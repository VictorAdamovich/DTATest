import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import type { User } from '@/entities/session';
import { ApiError } from './errors';

export const SESSION_COOKIE = 'tm_session';
const SECRET = process.env.SESSION_SECRET ?? 'dev-secret-change-me';

export const DEMO_USER: User = { id: 'user-1', email: 'admin@example.com', name: 'Администратор' };
export const DEMO_PASSWORD = 'Admin123!';

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('hex');
}

export function signSession(email: string): string {
  const payload = Buffer.from(email, 'utf8').toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token: string): { email: string } | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const givenBuffer = Buffer.from(signature, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  if (givenBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(givenBuffer, expectedBuffer)) return null;

  return { email: Buffer.from(payload, 'base64url').toString('utf8') };
}

export async function getSession(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySession(token);
  return payload?.email === DEMO_USER.email ? DEMO_USER : null;
}

export async function requireSession(): Promise<User> {
  const user = await getSession();
  if (!user) throw new ApiError(401, 'Требуется авторизация');
  return user;
}
