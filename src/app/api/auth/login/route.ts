import { NextRequest } from 'next/server';
import { userOperations } from '@/lib/database';
import {
  createSuccessResponse,
  createServerError,
  parseRequestBody,
  validateString,
} from '@/lib/api-utils';
import { getSession } from '@/lib/session';

interface LoginRequest {
  userName: string;
  avatar?: string;
}

// POST /api/auth/login - ユーザーログイン（作成または取得）
export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<LoginRequest>(request);
    validateString(body.userName, 'ユーザー名', 1, 50);

    // ユーザー名でユーザーを検索または作成
    let user = await userOperations.findByName(body.userName);

    if (!user) {
      // 新規ユーザーを作成
      user = await userOperations.create({
        name: body.userName,
        avatar: body.avatar || null,
      });
    }

    // セッションに保存
    const session = await getSession();
    session.userId = user.id;
    session.userName = user.name;
    session.userAvatar = user.avatar;
    await session.save();

    return createSuccessResponse(
      {
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
      },
      'ログインしました',
    );
  } catch (error) {
    console.error('POST /api/auth/login Error:', error);
    if (error instanceof Error) {
      return createServerError(error.message);
    }
    return createServerError();
  }
}
