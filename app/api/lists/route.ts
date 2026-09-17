import { NextResponse } from 'next/server';
import { createList, listLists } from '@/server/controllers/lists.controller';
import { protectedRoute, readJson } from '@/server/http';

export const GET = protectedRoute((request) => {
  const query = new URL(request.url).searchParams.get('q') ?? undefined;
  return NextResponse.json({ lists: listLists({ query, now: new Date() }) });
});

export const POST = protectedRoute(async (request) => {
  const list = createList(await readJson(request), new Date());
  return NextResponse.json({ list }, { status: 201 });
});
