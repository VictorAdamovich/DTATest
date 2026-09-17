import { describe, expect, it } from 'vitest';
import { makeTask } from '@/testing/factories';
import { sortTasks } from './sort';

const now = new Date('2026-06-01T12:00:00.000Z');
const ids = (tasks: { id: string }[]) => tasks.map((task) => task.id);

describe('sortTasks', () => {
  it('опускает выполненные задачи вниз даже при самом близком дедлайне', () => {
    const done = makeTask({ id: 'done', status: 'done', dueDate: '2026-05-01T12:00:00.000Z' });
    const open = makeTask({ id: 'open', status: 'new', dueDate: '2026-12-01T12:00:00.000Z' });
    expect(ids(sortTasks([done, open], now))).toEqual(['open', 'done']);
  });

  it('поднимает просроченные незавершённые задачи выше остальных', () => {
    const overdue = makeTask({ id: 'overdue', dueDate: '2026-05-30T12:00:00.000Z' });
    const soon = makeTask({ id: 'soon', dueDate: '2026-06-01T18:00:00.000Z' });
    expect(ids(sortTasks([soon, overdue], now))).toEqual(['overdue', 'soon']);
  });

  it('внутри группы ставит выше задачу с более близким дедлайном', () => {
    const later = makeTask({ id: 'later', dueDate: '2026-06-10T12:00:00.000Z' });
    const sooner = makeTask({ id: 'sooner', dueDate: '2026-06-02T12:00:00.000Z' });
    expect(ids(sortTasks([later, sooner], now))).toEqual(['sooner', 'later']);
  });

  it('отправляет задачи без дедлайна в конец своей группы', () => {
    const noDue = makeTask({ id: 'no-due' });
    const withDue = makeTask({ id: 'with-due', dueDate: '2026-07-01T12:00:00.000Z' });
    const done = makeTask({ id: 'done', status: 'done' });
    expect(ids(sortTasks([noDue, done, withDue], now))).toEqual(['with-due', 'no-due', 'done']);
  });

  it('использует приоритет как tie-breaker при равных дедлайнах', () => {
    const low = makeTask({ id: 'low', priority: 'low', dueDate: '2026-06-05T12:00:00.000Z' });
    const high = makeTask({ id: 'high', priority: 'high', dueDate: '2026-06-05T12:00:00.000Z' });
    const medium = makeTask({
      id: 'medium',
      priority: 'medium',
      dueDate: '2026-06-05T12:00:00.000Z',
    });
    expect(ids(sortTasks([low, medium, high], now))).toEqual(['high', 'medium', 'low']);
  });

  it('при полностью равных ключах сохраняет порядок по createdAt и не мутирует вход', () => {
    const older = makeTask({ id: 'older', createdAt: '2026-01-01T00:00:00.000Z' });
    const newer = makeTask({ id: 'newer', createdAt: '2026-02-01T00:00:00.000Z' });
    const input = [newer, older];
    expect(ids(sortTasks(input, now))).toEqual(['older', 'newer']);
    expect(ids(input)).toEqual(['newer', 'older']);
  });
});
