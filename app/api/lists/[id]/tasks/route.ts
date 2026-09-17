import { NextResponse } from 'next/server';
import { createTask } from '@/server/controllers/tasks.controller';
import { protectedRoute, readJson } from '@/server/http';

export const POST = protectedRoute<{ id: string }>(async (request, { id }) => {
  const task = createTask(id, await readJson(request), new Date());
  return NextResponse.json({ task }, { status: 201 });
});
