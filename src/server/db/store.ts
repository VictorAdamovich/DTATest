import type { Task } from '@/entities/task';
import type { TaskList } from '@/entities/task-list';
import { buildSeed } from './seed';

export type Db = {
  lists: Map<string, TaskList>;
  tasks: Map<string, Task>;
};

const DB_KEY = Symbol.for('task-manager.db');

type GlobalWithDb = typeof globalThis & { [DB_KEY]?: Db };

function createDb(now: Date): Db {
  const { lists, tasks } = buildSeed(now);
  return {
    lists: new Map(lists.map((list) => [list.id, list])),
    tasks: new Map(tasks.map((task) => [task.id, task])),
  };
}

/** Kept on globalThis so the store survives hot reloads in dev. */
export function getDb(): Db {
  const globalWithDb = globalThis as GlobalWithDb;
  globalWithDb[DB_KEY] ??= createDb(new Date());
  return globalWithDb[DB_KEY];
}

/** For tests: a deterministic seed at a fixed time. */
export function resetDb(now: Date = new Date()): Db {
  const globalWithDb = globalThis as GlobalWithDb;
  globalWithDb[DB_KEY] = createDb(now);
  return globalWithDb[DB_KEY];
}
