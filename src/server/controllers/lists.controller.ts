import { filterTasks, sortTasks, type Task, type TaskFilter } from '@/entities/task';
import {
  computeListStats,
  listTitleSchema,
  type ListStats,
  type ListWithStats,
  type TaskList,
} from '@/entities/task-list';
import { ApiError } from '../errors';
import { listRepository } from '../repositories/list.repository';
import { taskRepository } from '../repositories/task.repository';
import { parseInput } from '../validation';

export type ListDetails = { list: TaskList; tasks: Task[]; stats: ListStats };

function requireList(id: string): TaskList {
  const list = listRepository.findById(id);
  if (!list) throw new ApiError(404, 'Список не найден');
  return list;
}

export function listLists({ query, now }: { query?: string; now: Date }): ListWithStats[] {
  return listRepository.findAll(query).map((list) => ({
    ...list,
    stats: computeListStats(taskRepository.findByListId(list.id), now),
  }));
}

export function createList(input: unknown, now: Date): TaskList {
  const { title } = parseInput(listTitleSchema, input);
  return listRepository.create(title, now);
}

export function renameList(id: string, input: unknown, now: Date): TaskList {
  requireList(id);
  const { title } = parseInput(listTitleSchema, input);
  const renamed = listRepository.update(id, title, now);
  if (!renamed) throw new ApiError(404, 'Список не найден');
  return renamed;
}

export function deleteList(id: string): void {
  requireList(id);
  listRepository.remove(id);
}

export function getListDetails(
  id: string,
  { filter, now }: { filter: TaskFilter; now: Date },
): ListDetails {
  const list = requireList(id);
  const allTasks = taskRepository.findByListId(id);

  return {
    list,
    tasks: sortTasks(filterTasks(allTasks, filter, now), now),
    // Card counters ignore the active filter.
    stats: computeListStats(allTasks, now),
  };
}
