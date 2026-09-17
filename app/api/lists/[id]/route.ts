import { NextResponse } from 'next/server';
import { parseTaskFilter } from '@/entities/task';
import { deleteList, getListDetails, renameList } from '@/server/controllers/lists.controller';
import { noContent, protectedRoute, readJson } from '@/server/http';

type Params = { id: string };

export const GET = protectedRoute<Params>((request, { id }) => {
  const filter = parseTaskFilter(new URL(request.url).searchParams.get('status'));
  return NextResponse.json(getListDetails(id, { filter, now: new Date() }));
});

export const PATCH = protectedRoute<Params>(async (request, { id }) => {
  const list = renameList(id, await readJson(request), new Date());
  return NextResponse.json({ list });
});

export const DELETE = protectedRoute<Params>((_request, { id }) => {
  deleteList(id);
  return noContent();
});
