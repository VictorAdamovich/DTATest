import type { Task } from '@/entities/task';

let seq = 0;

export function makeTask(overrides: Partial<Task> = {}): Task {
  seq += 1;
  return {
    id: `task-${seq}`,
    listId: 'list-1',
    title: `Задача ${seq}`,
    description: '',
    status: 'new',
    priority: 'medium',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}
