import { describe, expect, it } from 'vitest';
import { makeTask } from '@/testing/factories';
import { filterTasks, parseTaskFilter } from './filter';

const now = new Date('2026-06-01T12:00:00.000Z');

describe('filterTasks', () => {
  const tasks = [
    makeTask({ id: 'new', status: 'new' }),
    makeTask({ id: 'progress', status: 'in_progress', dueDate: '2026-05-01T12:00:00.000Z' }),
    makeTask({ id: 'done', status: 'done' }),
  ];

  it('возвращает все задачи для фильтра all', () => {
    expect(filterTasks(tasks, 'all', now)).toHaveLength(3);
  });

  it('фильтрует по конкретному статусу', () => {
    expect(filterTasks(tasks, 'done', now).map((task) => task.id)).toEqual(['done']);
  });

  it('фильтрует по вычисляемому псевдо-статусу overdue', () => {
    expect(filterTasks(tasks, 'overdue', now).map((task) => task.id)).toEqual(['progress']);
  });
});

describe('parseTaskFilter', () => {
  it('принимает известные значения и отбрасывает мусор', () => {
    expect(parseTaskFilter('overdue')).toBe('overdue');
    expect(parseTaskFilter('nonsense')).toBe('all');
    expect(parseTaskFilter(null)).toBe('all');
  });
});
