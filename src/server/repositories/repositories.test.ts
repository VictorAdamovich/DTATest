import { beforeEach, describe, expect, it } from 'vitest';
import { resetDb } from '../db/store';
import { listRepository } from './list.repository';
import { taskRepository } from './task.repository';

const now = new Date('2026-06-01T12:00:00.000Z');

beforeEach(() => {
  resetDb(now);
});

describe('listRepository', () => {
  it('создаёт список и находит его по id', () => {
    const created = listRepository.create('Ремонт', now);
    expect(listRepository.findById(created.id)).toEqual(created);
  });

  it('ищет списки по подстроке без учёта регистра', () => {
    listRepository.create('Дача и грядки', now);
    expect(listRepository.findAll('дАча').map((list) => list.title)).toEqual(['Дача и грядки']);
  });

  it('переименовывает список и обновляет updatedAt', () => {
    const created = listRepository.create('Старое', now);
    const later = new Date(now.getTime() + 1000);
    const updated = listRepository.update(created.id, 'Новое', later);
    expect(updated?.title).toBe('Новое');
    expect(updated?.updatedAt).toBe(later.toISOString());
  });

  it('удаляет список вместе с его задачами', () => {
    const list = listRepository.create('Временный', now);
    taskRepository.create(
      { listId: list.id, title: 'Задача', description: '', status: 'new', priority: 'medium' },
      now,
    );
    expect(listRepository.remove(list.id)).toBe(true);
    expect(listRepository.findById(list.id)).toBeNull();
    expect(taskRepository.findByListId(list.id)).toEqual([]);
  });
});

describe('taskRepository', () => {
  it('создаёт задачу с id и временными метками', () => {
    const list = listRepository.create('Список', now);
    const task = taskRepository.create(
      { listId: list.id, title: 'Купить молоко', description: '', status: 'new', priority: 'high' },
      now,
    );
    expect(task.id).toBeTruthy();
    expect(task.createdAt).toBe(now.toISOString());
    expect(taskRepository.findByListId(list.id)).toHaveLength(1);
  });

  it('обновляет только переданные поля', () => {
    const list = listRepository.create('Список', now);
    const task = taskRepository.create(
      { listId: list.id, title: 'Черновик', description: 'текст', status: 'new', priority: 'low' },
      now,
    );
    const updated = taskRepository.update(task.id, { status: 'done' }, now);
    expect(updated?.status).toBe('done');
    expect(updated?.title).toBe('Черновик');
    expect(updated?.description).toBe('текст');
  });

  it('возвращает null при обновлении несуществующей задачи', () => {
    expect(taskRepository.update('missing', { status: 'done' }, now)).toBeNull();
  });
});
