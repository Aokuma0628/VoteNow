import { NextRequest } from 'next/server';
import { createSuccessResponse, createUnauthorizedError } from '@/lib/api-utils';
import { getSession } from '@/lib/session';
import { userOperations } from '@/lib/database';

// GET /api/auth/me - 現在のユーザー情報取得
export async function GET(_request: NextRequest) {
  const session = await getSession();

  if (!session.userId) {
    return createUnauthorizedError('ログインしていません');
  }

  const user = await userOperations.findById(session.userId);

  if (!user) {
    // セッションに保存されているユーザーが存在しない場合
    session.destroy();
    return createUnauthorizedError('ユーザーが見つかりません');
  }

  return createSuccessResponse({
    user: {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
    },
  });
}
