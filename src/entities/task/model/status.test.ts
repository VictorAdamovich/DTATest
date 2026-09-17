import { describe, expect, it } from 'vitest';
import { makeTask } from '@/testing/factories';
import { DUE_SOON_WINDOW_MS, isDueSoon, isOverdue } from './status';

const now = new Date('2026-06-01T12:00:00.000Z');

describe('isOverdue', () => {
  it('считает просроченной незавершённую задачу с дедлайном в прошлом', () => {
    const task = makeTask({ status: 'in_progress', dueDate: '2026-05-31T12:00:00.000Z' });
    expect(isOverdue(task, now)).toBe(true);
  });

  it('не считает просроченной задачу, дедлайн которой ровно сейчас', () => {
    const task = makeTask({ dueDate: now.toISOString() });
    expect(isOverdue(task, now)).toBe(false);
  });

  it('никогда не считает просроченной выполненную задачу', () => {
    const task = makeTask({ status: 'done', dueDate: '2026-05-01T12:00:00.000Z' });
    expect(isOverdue(task, now)).toBe(false);
  });

  it('не считает просроченной задачу без дедлайна', () => {
    expect(isOverdue(makeTask(), now)).toBe(false);
  });
});

describe('isDueSoon', () => {
  it('включает дедлайн ровно на границе 48 часов', () => {
    const task = makeTask({ dueDate: new Date(now.getTime() + DUE_SOON_WINDOW_MS).toISOString() });
    expect(isDueSoon(task, now)).toBe(true);
  });

  it('исключает дедлайн за миллисекунду после границы 48 часов', () => {
    const task = makeTask({
      dueDate: new Date(now.getTime() + DUE_SOON_WINDOW_MS + 1).toISOString(),
    });
    expect(isDueSoon(task, now)).toBe(false);
  });

  it('исключает уже просроченные и выполненные задачи', () => {
    expect(isDueSoon(makeTask({ dueDate: '2026-05-31T12:00:00.000Z' }), now)).toBe(false);
    expect(isDueSoon(makeTask({ status: 'done', dueDate: now.toISOString() }), now)).toBe(false);
  });
});
