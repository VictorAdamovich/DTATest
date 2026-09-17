import { beforeEach, describe, expect, it } from 'vitest';
import { resetDb } from '../db/store';
import { ApiError } from '../errors';
import { listLists } from './lists.controller';
import { createTask, deleteTask, getTask, updateTask } from './tasks.controller';

const now = new Date('2026-06-01T12:00:00.000Z');
const listId = () => listLists({ now })[0]!.id;

beforeEach(() => {
  resetDb(now);
});

describe('createTask', () => {
  it('создаёт задачу со значениями по умолчанию', () => {
    const task = createTask(listId(), { title: 'Новая задача' }, now);
    expect(task.status).toBe('new');
    expect(task.priority).toBe('medium');
    expect(task.description).toBe('');
    expect(task.dueDate).toBeUndefined();
  });

  it('бросает 404 для несуществующего списка', () => {
    expect(() => createTask('missing', { title: 'Задача' }, now)).toThrowError(ApiError);
  });

  it('бросает 400 на пустом названии', () => {
    try {
      createTask(listId(), { title: '' }, now);
      throw new Error('должно было бросить');
    } catch (error) {
      expect((error as ApiError).status).toBe(400);
    }
  });
});

describe('updateTask', () => {
  it('меняет статус, не трогая остальные поля', () => {
    const created = createTask(listId(), { title: 'Задача', description: 'текст' }, now);
    const updated = updateTask(created.id, { status: 'done' }, now);
    expect(updated.status).toBe('done');
    expect(updated.description).toBe('текст');
  });

  it('снимает дедлайн, когда пришёл null', () => {
    const created = createTask(
      listId(),
      { title: 'Задача', dueDate: '2026-07-01T12:00:00.000Z' },
      now,
    );
    expect(updateTask(created.id, { dueDate: null }, now).dueDate).toBeUndefined();
  });

  it('бросает 404 для несуществующей задачи', () => {
    expect(() => updateTask('missing', { status: 'done' }, now)).toThrowError(ApiError);
  });
});

describe('getTask и deleteTask', () => {
  it('удаляет задачу, после чего getTask бросает 404', () => {
    const created = createTask(listId(), { title: 'Задача' }, now);
    expect(getTask(created.id).id).toBe(created.id);
    deleteTask(created.id);
    expect(() => getTask(created.id)).toThrowError(ApiError);
  });
});
