import { NextRequest } from 'next/server';
import { createSuccessResponse } from '@/lib/api-utils';
import { getSession } from '@/lib/session';

// POST /api/auth/logout - ログアウト
export async function POST(_request: NextRequest) {
  const session = await getSession();
  session.destroy();

  return createSuccessResponse(null, 'ログアウトしました');
}
