import { NextResponse } from 'next/server';
import { login } from '@/server/controllers/auth.controller';
import { publicRoute, readJson } from '@/server/http';
import { SESSION_COOKIE, signSession } from '@/server/session';

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export const POST = publicRoute(async (request) => {
  const user = login(await readJson(request));

  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE, signSession(user.email), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ONE_WEEK_IN_SECONDS,
  });
  return response;
});
