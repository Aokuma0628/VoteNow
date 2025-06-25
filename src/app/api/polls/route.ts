import { NextRequest } from 'next/server';
import { pollOperations } from '@/lib/database';
import {
  createSuccessResponse,
  createMethodNotAllowedError,
  withErrorHandling,
  getQueryParams,
  getPaginationParams,
  validateString,
  validateArray,
  parseRequestBody,
} from '@/lib/api-utils';
import type { PollsListResponse, CreatePollRequest } from '@/types/api';

// GET /api/polls - 投票一覧取得
export const GET = withErrorHandling(async (request: NextRequest) => {
  const searchParams = getQueryParams(request);
  const { limit, skip } = getPaginationParams(searchParams);

  // クエリパラメータの取得
  const category = searchParams.get('category') || undefined;
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;

  // データベースから投票一覧を取得
  const polls = await pollOperations.findAll();

  // フィルタリング
  let filteredPolls = polls;

  if (category) {
    filteredPolls = filteredPolls.filter(poll => poll.category === category);
  }

  if (status) {
    filteredPolls = filteredPolls.filter(poll => poll.status === status);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredPolls = filteredPolls.filter(
      poll =>
        poll.title.toLowerCase().includes(searchLower) ||
        poll.description?.toLowerCase().includes(searchLower),
    );
  }

  // ページネーション
  const total = filteredPolls.length;
  const paginatedPolls = filteredPolls.slice(skip, skip + limit);

  // レスポンス用データの変換
  const pollsWithStats = paginatedPolls.map(poll => ({
    id: poll.id,
    title: poll.title,
    description: poll.description,
    category: poll.category,
    status: poll.status,
    allowMultiple: poll.allowMultiple,
    allowAddOptions: poll.allowAddOptions,
    isPublic: poll.isPublic,
    expiresAt: poll.expiresAt,
    createdAt: poll.createdAt,
    updatedAt: poll.updatedAt,
    createdBy: poll.createdBy,
    creator: poll.creator,
    options: poll.options.map(option => ({
      id: option.id,
      text: option.text,
      description: option.description,
      votes: option.votes,
      _count: {
        votes: option.votes.length,
      },
    })),
    totalVotes: poll.votes.length,
    _count: {
      votes: poll.votes.length,
    },
  }));

  const response: PollsListResponse = {
    success: true,
    data: {
      polls: pollsWithStats,
      total,
    },
  };

  return createSuccessResponse(response.data);
});

// POST /api/polls - 投票作成
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await parseRequestBody<CreatePollRequest>(request);

  // バリデーション
  validateString(body.title, 'タイトル', 1, 200);
  validateString(body.category, 'カテゴリ');
  validateArray(body.options, '選択肢', 2);

  if (body.description) {
    validateString(body.description, '説明', 0, 1000);
  }

  // 選択肢のバリデーション
  body.options.forEach((option, index) => {
    validateString(option.text, `選択肢${index + 1}のテキスト`, 1, 100);
    if (option.description) {
      validateString(option.description, `選択肢${index + 1}の説明`, 0, 200);
    }
  });

  // 期限の検証
  let expiresAt: Date | undefined;
  if (body.expiresAt) {
    expiresAt = new Date(body.expiresAt);
    if (isNaN(expiresAt.getTime())) {
      throw new Error('期限の形式が正しくありません');
    }
    if (expiresAt <= new Date()) {
      throw new Error('期限は現在時刻より後である必要があります');
    }
  }

  // TODO: 実際のアプリでは認証されたユーザーIDを使用
  // 今回は仮のユーザーIDを使用
  const createdBy = 'temp-user-id';

  // 投票を作成
  const poll = await pollOperations.create({
    title: body.title,
    description: body.description,
    category: body.category,
    createdBy,
    allowMultiple: body.allowMultiple || false,
    allowAddOptions: body.allowAddOptions || false,
    isPublic: body.isPublic !== false, // デフォルトtrue
    expiresAt,
    options: body.options,
  });

  // 作成された投票を詳細情報付きで取得
  const createdPoll = await pollOperations.findById(poll.id);

  if (!createdPoll) {
    throw new Error('作成された投票の取得に失敗しました');
  }

  // レスポンス用データの変換
  const pollWithStats = {
    id: createdPoll.id,
    title: createdPoll.title,
    description: createdPoll.description,
    category: createdPoll.category,
    status: createdPoll.status,
    allowMultiple: createdPoll.allowMultiple,
    allowAddOptions: createdPoll.allowAddOptions,
    isPublic: createdPoll.isPublic,
    expiresAt: createdPoll.expiresAt,
    createdAt: createdPoll.createdAt,
    updatedAt: createdPoll.updatedAt,
    createdBy: createdPoll.createdBy,
    creator: createdPoll.creator,
    options: createdPoll.options.map(option => ({
      id: option.id,
      text: option.text,
      description: option.description,
      votes: option.votes,
      _count: {
        votes: option.votes.length,
      },
    })),
    totalVotes: createdPoll.votes.length,
    _count: {
      votes: createdPoll.votes.length,
    },
  };

  return createSuccessResponse(pollWithStats, '投票が作成されました', 201);
});

// 他のHTTPメソッドは許可しない
export async function PUT() {
  return createMethodNotAllowedError(['GET', 'POST']);
}

export async function DELETE() {
  return createMethodNotAllowedError(['GET', 'POST']);
}

export async function PATCH() {
  return createMethodNotAllowedError(['GET', 'POST']);
}
