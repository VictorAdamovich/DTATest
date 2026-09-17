import { isOverdue } from './status';
import type { Priority, Task } from './types';

const PRIORITY_WEIGHT: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

function deadlineOf(task: Task): number | null {
  if (!task.dueDate) return null;
  const time = new Date(task.dueDate).getTime();
  return Number.isNaN(time) ? null : time;
}

/** Earlier deadline first; tasks without one go last. */
function compareDeadlines(a: Task, b: Task): number {
  const aDeadline = deadlineOf(a);
  const bDeadline = deadlineOf(b);

  if (aDeadline === bDeadline) return 0;
  if (aDeadline === null) return 1;
  if (bDeadline === null) return -1;
  return aDeadline - bDeadline;
}

function compareTasks(a: Task, b: Task, now: Date): number {
  const aDone = a.status === 'done';
  const bDone = b.status === 'done';
  if (aDone !== bDone) return aDone ? 1 : -1;

  if (!aDone) {
    const aOverdue = isOverdue(a, now);
    const bOverdue = isOverdue(b, now);
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
  }

  return (
    compareDeadlines(a, b) ||
    PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority] ||
    a.createdAt.localeCompare(b.createdAt)
  );
}

/**
 * 1. Done tasks go last.
 * 2. Overdue tasks go first.
 * 3. Earlier deadline first.
 * 4. Ties: higher priority, then older first.
 */
export function sortTasks(tasks: Task[], now: Date): Task[] {
  return [...tasks].sort((a, b) => compareTasks(a, b, now));
}
