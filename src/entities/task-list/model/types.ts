import type { TaskStatus } from '@/entities/task/@x/task-list';

export type TaskList = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type ListIndicator = 'red' | 'yellow' | 'none';

export type ListStats = {
  counts: Record<TaskStatus, number> & { overdue: number };
  total: number;
  progress: number;
  indicator: ListIndicator;
};

export type ListWithStats = TaskList & { stats: ListStats };
