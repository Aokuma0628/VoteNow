import { NextRequest } from 'next/server';
import { voteOperations, userOperations } from '@/lib/database';
import {
  createSuccessResponse,
  createNotFoundError,
  createMethodNotAllowedError,
  withErrorHandling,
} from '@/lib/api-utils';
import { getOrCreateSessionId } from '@/lib/session';

// GET /api/polls/[id]/user-votes - ユーザーの投票履歴取得
export const GET = withErrorHandling(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id: pollId } = await context.params;

    if (typeof pollId !== 'string') {
      return createNotFoundError('投票');
    }

    // セッションIDを取得し、ユーザーを取得
    const sessionId = await getOrCreateSessionId();
    const user = await userOperations.findOrCreateGuest(sessionId);
    const userId = user.id;

    // ユーザーの投票履歴を取得
    const userVotes = await voteOperations.findUserVoteForPoll(userId, pollId);

    const votesWithDetails = userVotes.map(vote => ({
      id: vote.id,
      userId: vote.userId,
      pollId: vote.pollId,
      optionId: vote.optionId,
      votedAt: vote.votedAt,
      option: {
        id: vote.option.id,
        text: vote.option.text,
        description: vote.option.description,
      },
    }));

    return createSuccessResponse({
      hasVoted: userVotes.length > 0,
      votes: votesWithDetails,
      optionIds: userVotes.map(vote => vote.optionId),
    });
  },
);

// 他のHTTPメソッドは許可しない
export async function POST() {
  return createMethodNotAllowedError(['GET']);
}

export async function PUT() {
  return createMethodNotAllowedError(['GET']);
}

export async function DELETE() {
  return createMethodNotAllowedError(['GET']);
}

export async function PATCH() {
  return createMethodNotAllowedError(['GET']);
}
