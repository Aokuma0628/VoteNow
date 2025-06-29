import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export interface SessionData {
  sessionId: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'votenow-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1週間
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  // セッションIDが存在しない場合は新規作成
  if (!session.sessionId) {
    session.sessionId = randomUUID();
    await session.save();
  }

  return session;
}

export async function getOrCreateSessionId() {
  const session = await getSession();
  return session.sessionId;
}
