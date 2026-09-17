import { NextResponse } from 'next/server';
import { deleteTask, getTask, updateTask } from '@/server/controllers/tasks.controller';
import { noContent, protectedRoute, readJson } from '@/server/http';

type Params = { id: string };

export const GET = protectedRoute<Params>((_request, { id }) =>
  NextResponse.json({ task: getTask(id) }),
);

export const PATCH = protectedRoute<Params>(async (request, { id }) => {
  const task = updateTask(id, await readJson(request), new Date());
  return NextResponse.json({ task });
});

export const DELETE = protectedRoute<Params>((_request, { id }) => {
  deleteTask(id);
  return noContent();
});
