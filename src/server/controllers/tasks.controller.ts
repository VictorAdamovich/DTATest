import { createTaskSchema, updateTaskSchema, type Task } from '@/entities/task';
import { ApiError } from '../errors';
import { listRepository } from '../repositories/list.repository';
import { taskRepository } from '../repositories/task.repository';
import { parseInput } from '../validation';

export function getTask(id: string): Task {
  const task = taskRepository.findById(id);
  if (!task) throw new ApiError(404, 'Задача не найдена');
  return task;
}

export function createTask(listId: string, input: unknown, now: Date): Task {
  if (!listRepository.findById(listId)) throw new ApiError(404, 'Список не найден');

  const fields = parseInput(createTaskSchema, input);
  return taskRepository.create({ listId, ...fields }, now);
}

export function updateTask(id: string, input: unknown, now: Date): Task {
  getTask(id);

  // `dueDate: null` clears the deadline; a missing key leaves it unchanged.
  const { dueDate, ...fields } = parseInput(updateTaskSchema, input);
  const patch: Partial<Task> =
    dueDate === undefined ? fields : { ...fields, dueDate: dueDate ?? undefined };

  const updated = taskRepository.update(id, patch, now);
  if (!updated) throw new ApiError(404, 'Задача не найдена');
  return updated;
}

export function deleteTask(id: string): void {
  getTask(id);
  taskRepository.remove(id);
}
