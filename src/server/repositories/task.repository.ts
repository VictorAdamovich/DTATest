import type { Task } from '@/entities/task';
import { getDb } from '../db/store';

type NewTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
type TaskPatch = Partial<Omit<Task, 'id' | 'listId' | 'createdAt'>>;

export const taskRepository = {
  findByListId(listId: string): Task[] {
    return [...getDb().tasks.values()].filter((task) => task.listId === listId);
  },

  findById(id: string): Task | null {
    return getDb().tasks.get(id) ?? null;
  },

  create(input: NewTask, now: Date): Task {
    const timestamp = now.toISOString();
    const task: Task = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    getDb().tasks.set(task.id, task);
    return task;
  },

  update(id: string, patch: TaskPatch, now: Date): Task | null {
    const db = getDb();
    const task = db.tasks.get(id);
    if (!task) return null;
    const updated: Task = { ...task, ...patch, updatedAt: now.toISOString() };
    db.tasks.set(id, updated);
    return updated;
  },

  remove(id: string): boolean {
    return getDb().tasks.delete(id);
  },
};
