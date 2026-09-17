import type { Priority, Task, TaskStatus } from '@/entities/task';
import type { TaskList } from '@/entities/task-list';

const HOUR = 60 * 60 * 1000;

type SeedTask = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  /** Hours from `now`; `null` means no deadline. */
  dueInHours: number | null;
};

const SEED: { title: string; tasks: SeedTask[] }[] = [
  {
    title: 'Запуск лендинга',
    tasks: [
      {
        title: 'Свёрстать главный экран',
        description: 'Десктоп и мобильная версия',
        status: 'in_progress',
        priority: 'high',
        dueInHours: -20,
      },
      {
        title: 'Подключить аналитику',
        description: '',
        status: 'new',
        priority: 'medium',
        dueInHours: 12,
      },
      {
        title: 'Купить домен',
        description: 'Через регистратора',
        status: 'done',
        priority: 'low',
        dueInHours: -100,
      },
    ],
  },
  {
    title: 'Ремонт кухни',
    tasks: [
      {
        title: 'Заказать плитку',
        description: 'Матовая, 30×60',
        status: 'new',
        priority: 'high',
        dueInHours: 30,
      },
      {
        title: 'Вызвать электрика',
        description: '',
        status: 'new',
        priority: 'medium',
        dueInHours: null,
      },
    ],
  },
  {
    title: 'Учёба',
    tasks: [
      {
        title: 'Досмотреть курс по TypeScript',
        description: 'Осталось 3 модуля',
        status: 'in_progress',
        priority: 'medium',
        dueInHours: 24 * 10,
      },
      {
        title: 'Сдать тест',
        description: '',
        status: 'done',
        priority: 'high',
        dueInHours: -24 * 3,
      },
    ],
  },
  {
    title: 'Личное',
    tasks: [
      {
        title: 'Записаться к врачу',
        description: '',
        status: 'done',
        priority: 'medium',
        dueInHours: -24,
      },
      {
        title: 'Продлить страховку',
        description: '',
        status: 'done',
        priority: 'low',
        dueInHours: -48,
      },
    ],
  },
];

export function buildSeed(now: Date): { lists: TaskList[]; tasks: Task[] } {
  const timestamp = now.toISOString();
  const lists: TaskList[] = [];
  const tasks: Task[] = [];

  SEED.forEach((seedList, listIndex) => {
    const listId = `list-${listIndex + 1}`;
    lists.push({ id: listId, title: seedList.title, createdAt: timestamp, updatedAt: timestamp });

    seedList.tasks.forEach((seedTask, taskIndex) => {
      tasks.push({
        id: `${listId}-task-${taskIndex + 1}`,
        listId,
        title: seedTask.title,
        description: seedTask.description,
        status: seedTask.status,
        priority: seedTask.priority,
        dueDate:
          seedTask.dueInHours === null
            ? undefined
            : new Date(now.getTime() + seedTask.dueInHours * HOUR).toISOString(),
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    });
  });

  return { lists, tasks };
}
