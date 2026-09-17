import { describe, expect, it } from 'vitest';
import { fromDateTimeLocal, toDateTimeLocal } from './datetime-local';

describe('datetime-local', () => {
  it('конвертирует ISO в значение input и обратно без потери минуты', () => {
    const iso = '2026-06-03T09:30:00.000Z';
    const local = toDateTimeLocal(iso);
    expect(local).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    expect(new Date(fromDateTimeLocal(local)!).getTime()).toBe(new Date(iso).setSeconds(0, 0));
  });

  it('отдаёт пустую строку и null для отсутствующей даты', () => {
    expect(toDateTimeLocal(undefined)).toBe('');
    expect(fromDateTimeLocal('')).toBeNull();
  });
});
