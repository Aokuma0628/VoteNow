import { NextRequest } from 'next/server';
import { voteOperations, userOperations } from '@/lib/database';
import {
  createSuccessResponse,
  createMethodNotAllowedError,
  withErrorHandling,
} from '@/lib/api-utils';
import { getOrCreateSessionId } from '@/lib/session';

// GET /api/user-votes - ユーザーのすべての投票履歴取得
export const GET = withErrorHandling(async (_request: NextRequest) => {
  // セッションIDを取得し、ユーザーを取得
  const sessionId = await getOrCreateSessionId();
  const user = await userOperations.findOrCreateGuest(sessionId);
  const userId = user.id;

  // ユーザーのすべての投票履歴を取得
  const userVotes = await voteOperations.findByUser(userId);

  // 投票IDごとにグループ化
  const votesByPoll = userVotes.reduce(
    (acc, vote) => {
      if (!acc[vote.pollId]) {
        acc[vote.pollId] = [];
      }
      acc[vote.pollId].push(vote.optionId);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  return createSuccessResponse({
    votesByPoll,
    totalVotes: userVotes.length,
  });
});

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
