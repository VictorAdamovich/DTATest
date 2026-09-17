export const TASK_STATUSES = ['new', 'in_progress', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const PRIORITIES = ['low', 'medium', 'high'] as const;
export type Priority = (typeof PRIORITIES)[number];

export type Task = {
  id: string;
  listId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  /** ISO 8601; optional. */
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

/** `overdue` is computed, never stored. */
export const TASK_FILTERS = ['all', ...TASK_STATUSES, 'overdue'] as const;
export type TaskFilter = (typeof TASK_FILTERS)[number];
