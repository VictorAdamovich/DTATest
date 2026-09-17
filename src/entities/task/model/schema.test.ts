import { describe, expect, it } from 'vitest';
import { createTaskSchema, updateTaskSchema } from './schema';

describe('createTaskSchema', () => {
  it('applies defaults for description, status, priority when given only title', () => {
    const result = createTaskSchema.safeParse({ title: 'Задача' });
    expect(result.success).toBe(true);
    expect(result.data?.description).toBe('');
    expect(result.data?.status).toBe('new');
    expect(result.data?.priority).toBe('medium');
    expect(result.data?.dueDate).toBeUndefined();
  });
});

describe('updateTaskSchema', () => {
  it('partial update with only title should not apply defaults to other fields', () => {
    const result = updateTaskSchema.safeParse({ title: 'Новое название' });
    expect(result.success).toBe(true);
    expect(Object.keys(result.data!)).toEqual(['title']);
  });

  it('accepts dueDate: null and rejects invalid datetime', () => {
    const resultNull = updateTaskSchema.safeParse({ dueDate: null });
    expect(resultNull.success).toBe(true);

    const resultInvalid = updateTaskSchema.safeParse({ dueDate: 'не дата' });
    expect(resultInvalid.success).toBe(false);
    expect(resultInvalid.error?.issues[0]?.message).toBe('Некорректная дата');
  });
});
