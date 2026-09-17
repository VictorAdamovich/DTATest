import type { User } from '@/entities/session';
import type { Task } from '@/entities/task';
import { computeListStats, type ListWithStats, type TaskList } from '@/entities/task-list';
import { makeTask } from './factories';

const MOCK_NOW = new Date('2026-06-01T12:00:00.000Z');

export const mockUser: User = { id: 'user-1', email: 'admin@example.com', name: 'Администратор' };

export const mockList: TaskList = {
  id: 'list-1',
  title: 'Запуск лендинга',
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
};

export const mockTasks: Task[] = [
  makeTask({
    id: 'task-1',
    listId: 'list-1',
    title: 'Свёрстать главный экран',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-06-01T09:00:00.000Z',
  }),
  makeTask({
    id: 'task-2',
    listId: 'list-1',
    title: 'Подключить аналитику',
    status: 'new',
    priority: 'medium',
    dueDate: '2026-06-03T09:00:00.000Z',
  }),
  makeTask({
    id: 'task-3',
    listId: 'list-1',
    title: 'Купить домен',
    status: 'done',
    priority: 'low',
  }),
];

export const mockListsWithStats: ListWithStats[] = [
  { ...mockList, stats: computeListStats(mockTasks, MOCK_NOW) },
  {
    id: 'list-2',
    title: 'Ремонт кухни',
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
    stats: computeListStats(
      [makeTask({ id: 'task-4', listId: 'list-2', status: 'new' })],
      MOCK_NOW,
    ),
  },
];
