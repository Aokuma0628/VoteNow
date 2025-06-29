import { NextRequest } from 'next/server';
import { pollOperations } from '@/lib/database';
import {
  createSuccessResponse,
  createNotFoundError,
  createMethodNotAllowedError,
  createServerError,
} from '@/lib/api-utils';
// GET /api/polls/[id] - 投票詳細取得
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (typeof id !== 'string') {
      return createNotFoundError('投票');
    }

    // データベースから投票詳細を取得
    const poll = await pollOperations.findById(id);

    if (!poll) {
      return createNotFoundError('投票');
    }

    // レスポンス用データの変換
    const pollWithDetails = {
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
      votes: poll.votes.map(vote => ({
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
      totalVotes: poll.votes.length,
      _count: {
        votes: poll.votes.length,
      },
    };

    return createSuccessResponse(pollWithDetails);
  } catch (error) {
    console.error('GET /api/polls/[id] Error:', error);
    return createServerError();
  }
}

// 他のHTTPメソッドは許可しない
export async function POST() {
  return createMethodNotAllowedError(['GET']);
}

export async function PUT() {
  return createMethodNotAllowedError(['GET']);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (typeof id !== 'string') {
      return createNotFoundError('投票');
    }

    // 投票の存在確認
    const poll = await pollOperations.findById(id);

    if (!poll) {
      return createNotFoundError('投票');
    }

    // 投票を削除（関連するデータも連鎖削除される）
    await pollOperations.delete(id);

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error('DELETE /api/polls/[id] Error:', error);
    return createServerError();
  }
}

export async function PATCH() {
  return createMethodNotAllowedError(['GET']);
}
