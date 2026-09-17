import { isDueSoon, isOverdue, type Task } from '@/entities/task/@x/task-list';
import type { ListIndicator, ListStats } from './types';

function indicatorFor(overdueCount: number, hasDueSoon: boolean): ListIndicator {
  if (overdueCount > 0) return 'red';
  if (hasDueSoon) return 'yellow';
  return 'none';
}

export function computeListStats(tasks: Task[], now: Date): ListStats {
  const counts = { new: 0, in_progress: 0, done: 0, overdue: 0 };
  let hasDueSoon = false;

  for (const task of tasks) {
    counts[task.status] += 1;
    if (isOverdue(task, now)) counts.overdue += 1;
    if (isDueSoon(task, now)) hasDueSoon = true;
  }

  const total = tasks.length;

  return {
    counts,
    total,
    progress: total === 0 ? 0 : counts.done / total,
    indicator: indicatorFor(counts.overdue, hasDueSoon),
  };
}
