import type { TaskList } from '@/entities/task-list';
import { getDb } from '../db/store';

export const listRepository = {
  findAll(query?: string): TaskList[] {
    const lists = [...getDb().lists.values()];
    const normalized = query?.trim().toLowerCase();
    const filtered = normalized
      ? lists.filter((list) => list.title.toLowerCase().includes(normalized))
      : lists;
    return filtered.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  findById(id: string): TaskList | null {
    return getDb().lists.get(id) ?? null;
  },

  create(title: string, now: Date): TaskList {
    const timestamp = now.toISOString();
    const list: TaskList = {
      id: crypto.randomUUID(),
      title,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    getDb().lists.set(list.id, list);
    return list;
  },

  update(id: string, title: string, now: Date): TaskList | null {
    const db = getDb();
    const list = db.lists.get(id);
    if (!list) return null;
    const updated: TaskList = { ...list, title, updatedAt: now.toISOString() };
    db.lists.set(id, updated);
    return updated;
  },

  remove(id: string): boolean {
    const db = getDb();
    if (!db.lists.delete(id)) return false;
    for (const [taskId, task] of db.tasks) {
      if (task.listId === id) db.tasks.delete(taskId);
    }
    return true;
  },
};
