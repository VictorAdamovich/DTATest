import type { Task } from './types';

export const DUE_SOON_WINDOW_MS = 48 * 60 * 60 * 1000;

type DeadlineFields = Pick<Task, 'status' | 'dueDate'>;

function dueTime(task: DeadlineFields): number | null {
  if (task.status === 'done' || !task.dueDate) return null;
  const time = new Date(task.dueDate).getTime();
  return Number.isNaN(time) ? null : time;
}

export function isOverdue(task: DeadlineFields, now: Date): boolean {
  const due = dueTime(task);
  return due !== null && due < now.getTime();
}

export function isDueSoon(task: DeadlineFields, now: Date): boolean {
  const due = dueTime(task);
  if (due === null) return false;
  return due >= now.getTime() && due <= now.getTime() + DUE_SOON_WINDOW_MS;
}
