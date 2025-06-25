import { NextRequest } from 'next/server';
import { pollOperations, voteOperations } from '@/lib/database';
import {
  createSuccessResponse,
  createNotFoundError,
  createValidationError,
  createMethodNotAllowedError,
  createServerError,
  parseRequestBody,
  validateArray,
} from '@/lib/api-utils';
import type { CastVoteRequest } from '@/types/api';

// POST /api/polls/[id]/vote - 投票実行
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: pollId } = await context.params;

    if (typeof pollId !== 'string') {
      return createNotFoundError('投票');
    }

    // リクエストボディの取得とバリデーション
    const body = await parseRequestBody<CastVoteRequest>(request);
    validateArray(body.optionIds, '選択肢', 1);

    // 投票の存在確認
    const poll = await pollOperations.findById(pollId);
    if (!poll) {
      return createNotFoundError('投票');
    }

    // 投票の状態確認
    if (poll.status !== 'active') {
      return createValidationError('この投票は現在受付けていません');
    }

    // 期限の確認
    if (poll.expiresAt && poll.expiresAt < new Date()) {
      return createValidationError('この投票は期限切れです');
    }

    // 選択肢の存在確認
    const validOptionIds = poll.options.map(option => option.id);
    const invalidOptions = body.optionIds.filter(optionId => !validOptionIds.includes(optionId));

    if (invalidOptions.length > 0) {
      return createValidationError('存在しない選択肢が含まれています');
    }

    // 複数選択の確認
    if (!poll.allowMultiple && body.optionIds.length > 1) {
      return createValidationError('この投票では複数選択できません');
    }

    // TODO: 実際のアプリでは認証されたユーザーIDを使用
    // 今回は仮のユーザーIDを使用
    const userId = 'temp-user-id';

    // 既存の投票確認
    const existingVotes = await voteOperations.findUserVoteForPoll(userId, pollId);

    // 複数選択を許可しない場合、既に投票済みなら拒否
    if (!poll.allowMultiple && existingVotes.length > 0) {
      return createValidationError('既にこの投票に参加しています');
    }

    // 既に同じ選択肢に投票済みかチェック
    const existingOptionIds = existingVotes.map(vote => vote.optionId);
    const duplicateOptions = body.optionIds.filter(optionId =>
      existingOptionIds.includes(optionId),
    );

    if (duplicateOptions.length > 0) {
      return createValidationError('既に選択済みの選択肢が含まれています');
    }

    // 投票を実行
    const votes = await Promise.all(
      body.optionIds.map(optionId =>
        voteOperations.cast({
          userId,
          pollId,
          optionId,
        }),
      ),
    );

    // 投票後の最新データを取得
    const updatedPoll = await pollOperations.findById(pollId);
    if (!updatedPoll) {
      throw new Error('投票後のデータ取得に失敗しました');
    }

    // レスポンス用データの変換
    const votesWithDetails = votes.map(vote => {
      const option = updatedPoll.options.find(opt => opt.id === vote.optionId);
      const user = { id: userId, name: 'ゲストユーザー', avatar: null }; // TODO: 実際のユーザー情報

      return {
        id: vote.id,
        userId: vote.userId,
        pollId: vote.pollId,
        optionId: vote.optionId,
        votedAt: vote.votedAt,
        user,
        option: option
          ? {
              id: option.id,
              text: option.text,
              description: option.description,
            }
          : {
              id: vote.optionId,
              text: '不明な選択肢',
              description: undefined,
            },
      };
    });

    const pollWithDetails = {
      id: updatedPoll.id,
      title: updatedPoll.title,
      description: updatedPoll.description,
      category: updatedPoll.category,
      status: updatedPoll.status,
      allowMultiple: updatedPoll.allowMultiple,
      allowAddOptions: updatedPoll.allowAddOptions,
      isPublic: updatedPoll.isPublic,
      expiresAt: updatedPoll.expiresAt,
      createdAt: updatedPoll.createdAt,
      updatedAt: updatedPoll.updatedAt,
      createdBy: updatedPoll.createdBy,
      creator: updatedPoll.creator,
      options: updatedPoll.options.map(option => ({
        id: option.id,
        text: option.text,
        description: option.description,
        votes: option.votes.map(vote => ({
          id: vote.id,
          userId: vote.userId,
          pollId: vote.pollId,
          optionId: vote.optionId,
          votedAt: vote.votedAt,
          user: vote.user,
          option: {
            id: vote.option.id,
            text: vote.option.text,
            description: vote.option.description,
          },
        })),
        _count: {
          votes: option.votes.length,
        },
      })),
      votes: updatedPoll.votes.map(vote => ({
        id: vote.id,
        userId: vote.userId,
        pollId: vote.pollId,
        optionId: vote.optionId,
        votedAt: vote.votedAt,
        user: vote.user,
        option: {
          id: vote.option.id,
          text: vote.option.text,
          description: vote.option.description,
        },
      })),
      totalVotes: updatedPoll.votes.length,
      _count: {
        votes: updatedPoll.votes.length,
      },
    };

    return createSuccessResponse(
      {
        votes: votesWithDetails,
        poll: pollWithDetails,
      },
      '投票が完了しました',
      201,
    );
  } catch (error) {
    console.error('POST /api/polls/[id]/vote Error:', error);
    if (error instanceof Error) {
      return createServerError(error.message);
    }
    return createServerError();
  }
}

// 他のHTTPメソッドは許可しない
export async function GET() {
  return createMethodNotAllowedError(['POST']);
}

export async function PUT() {
  return createMethodNotAllowedError(['POST']);
}

export async function DELETE() {
  return createMethodNotAllowedError(['POST']);
}

export async function PATCH() {
  return createMethodNotAllowedError(['POST']);
}
