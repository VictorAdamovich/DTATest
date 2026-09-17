import { NextResponse } from 'next/server';
import { publicRoute } from '@/server/http';
import { requireSession } from '@/server/session';

export const GET = publicRoute(async () => NextResponse.json({ user: await requireSession() }));
