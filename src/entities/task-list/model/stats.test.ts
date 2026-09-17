import { describe, expect, it } from 'vitest';
import { DUE_SOON_WINDOW_MS } from '@/entities/task/@x/task-list';
import { makeTask } from '@/testing/factories';
import { computeListStats } from './stats';

const now = new Date('2026-06-01T12:00:00.000Z');
const offset = (ms: number) => new Date(now.getTime() + ms).toISOString();

describe('computeListStats', () => {
  it('считает задачи по статусам и отдельно просроченные', () => {
    const stats = computeListStats(
      [
        makeTask({ status: 'new', dueDate: offset(-1000) }),
        makeTask({ status: 'in_progress' }),
        makeTask({ status: 'done', dueDate: offset(-5000) }),
      ],
      now,
    );
    expect(stats.counts).toEqual({ new: 1, in_progress: 1, done: 1, overdue: 1 });
    expect(stats.total).toBe(3);
  });

  it('считает прогресс как долю выполненных, а для пустого списка отдаёт ноль', () => {
    const stats = computeListStats([makeTask({ status: 'done' }), makeTask()], now);
    expect(stats.progress).toBe(0.5);
    expect(computeListStats([], now)).toEqual({
      counts: { new: 0, in_progress: 0, done: 0, overdue: 0 },
      total: 0,
      progress: 0,
      indicator: 'none',
    });
  });

  it('отдаёт красный индикатор при наличии просрочки, даже если есть близкие дедлайны', () => {
    const stats = computeListStats(
      [makeTask({ dueDate: offset(-1) }), makeTask({ dueDate: offset(1000) })],
      now,
    );
    expect(stats.indicator).toBe('red');
  });

  it('отдаёт жёлтый индикатор ровно на границе 48 часов и none за ней', () => {
    expect(
      computeListStats([makeTask({ dueDate: offset(DUE_SOON_WINDOW_MS) })], now).indicator,
    ).toBe('yellow');
    expect(
      computeListStats([makeTask({ dueDate: offset(DUE_SOON_WINDOW_MS + 1) })], now).indicator,
    ).toBe('none');
  });
});
