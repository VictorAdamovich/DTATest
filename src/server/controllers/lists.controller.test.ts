import { beforeEach, describe, expect, it } from 'vitest';
import { resetDb } from '../db/store';
import { ApiError } from '../errors';
import { createList, deleteList, getListDetails, listLists, renameList } from './lists.controller';

const now = new Date('2026-06-01T12:00:00.000Z');

beforeEach(() => {
  resetDb(now);
});

describe('listLists', () => {
  it('отдаёт списки со статистикой', () => {
    const lists = listLists({ now });
    const landing = lists.find((list) => list.title === 'Запуск лендинга');
    expect(landing?.stats.total).toBe(3);
    expect(landing?.stats.counts.overdue).toBe(1);
    expect(landing?.stats.indicator).toBe('red');
  });

  it('фильтрует списки по поисковому запросу', () => {
    expect(listLists({ query: 'учёба', now }).map((list) => list.title)).toEqual(['Учёба']);
  });
});

describe('createList', () => {
  it('создаёт список с обрезанным названием', () => {
    const created = createList({ title: '  Новый  ' }, now);
    expect(created.title).toBe('Новый');
  });

  it('бросает 400 на пустом названии', () => {
    try {
      createList({ title: '   ' }, now);
      throw new Error('должно было бросить');
    } catch (error) {
      expect((error as ApiError).status).toBe(400);
      expect((error as ApiError).message).toBe('Введите название');
    }
  });
});

describe('renameList и deleteList', () => {
  it('бросает 404 для несуществующего списка', () => {
    expect(() => renameList('missing', { title: 'Другое' }, now)).toThrowError(ApiError);
    expect(() => deleteList('missing')).toThrowError(ApiError);
  });
});

describe('getListDetails', () => {
  it('возвращает задачи отсортированными: просроченная выше, выполненная внизу', () => {
    const list = listLists({ now }).find((item) => item.title === 'Запуск лендинга');
    const details = getListDetails(list!.id, { filter: 'all', now });
    expect(details.tasks.map((task) => task.title)).toEqual([
      'Свёрстать главный экран',
      'Подключить аналитику',
      'Купить домен',
    ]);
  });

  it('применяет фильтр по статусу, но считает статистику по всем задачам', () => {
    const list = listLists({ now }).find((item) => item.title === 'Запуск лендинга');
    const details = getListDetails(list!.id, { filter: 'done', now });
    expect(details.tasks).toHaveLength(1);
    expect(details.stats.total).toBe(3);
  });
});
