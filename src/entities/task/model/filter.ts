import { isOverdue } from './status';
import { TASK_FILTERS, type Task, type TaskFilter } from './types';

export function filterTasks(tasks: Task[], filter: TaskFilter, now: Date): Task[] {
  if (filter === 'all') return tasks;
  if (filter === 'overdue') return tasks.filter((task) => isOverdue(task, now));
  return tasks.filter((task) => task.status === filter);
}

export function parseTaskFilter(value: string | null): TaskFilter {
  return TASK_FILTERS.includes(value as TaskFilter) ? (value as TaskFilter) : 'all';
}
