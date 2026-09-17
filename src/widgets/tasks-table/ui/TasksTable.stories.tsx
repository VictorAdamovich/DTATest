import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { delay, http, HttpResponse } from 'msw';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { sortTasks, useUpdateTask, type Task, type TaskStatus } from '@/entities/task';
import { useListDetails } from '@/entities/task-list';
import { mockList, mockListsWithStats, mockTasks } from '@/testing/mocks';
import { TasksTable } from './TasksTable';

const now = new Date('2026-06-01T12:00:00.000Z');

const meta: Meta<typeof TasksTable> = {
  title: 'Widgets/TasksTable',
  component: TasksTable,
  parameters: { layout: 'padded' },
  args: {
    tasks: sortTasks(mockTasks, now),
    now,
    loading: false,
    onStatusChange: fn(),
    onOpenTask: fn(),
    onDeleteTask: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TasksTable>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rows = canvas.getAllByRole('row').slice(1);
    // Overdue first, done last.
    await expect(within(rows[0]!).getByText('Свёрстать главный экран')).toBeInTheDocument();
    await expect(within(rows[0]!).getByText('Просрочено')).toBeInTheDocument();
    await expect(within(rows[2]!).getByText('Купить домен')).toBeInTheDocument();
  },
};

export const ChangesStatus: Story = {
  render: (args) => {
    const [tasks, setTasks] = useState<Task[]>(args.tasks);
    return (
      <TasksTable
        {...args}
        tasks={tasks}
        onStatusChange={(taskId, status) => {
          args.onStatusChange(taskId, status);
          setTasks((current) =>
            current.map((task) => (task.id === taskId ? { ...task, status } : task)),
          );
        }}
      />
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const screen = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByLabelText('Статус задачи «Подключить аналитику»'));
    await userEvent.click(await screen.findByRole('option', { name: 'Выполнена' }));

    await waitFor(() =>
      expect(args.onStatusChange).toHaveBeenCalledWith('task-2', 'done' satisfies TaskStatus),
    );
    // The label is on MUI's combobox div, which has no value — check its text.
    await waitFor(() =>
      expect(canvas.getByLabelText('Статус задачи «Подключить аналитику»')).toHaveTextContent(
        'Выполнена',
      ),
    );
  },
};

export const Empty: Story = { args: { tasks: [] } };

/** Clearing a deadline must update the row before the server responds. */
function ClearDeadlineHarness() {
  const listId = 'list-1';
  const updateTask = useUpdateTask(listId, 'all');
  const details = useListDetails(listId, 'all');

  if (!details.data) return null;

  return (
    <div>
      <button onClick={() => updateTask.mutate({ id: 'task-1', patch: { dueDate: null } })}>
        Очистить дедлайн
      </button>
      <TasksTable
        tasks={details.data.tasks}
        now={now}
        loading={false}
        onStatusChange={fn()}
        onOpenTask={fn()}
        onDeleteTask={fn()}
      />
    </div>
  );
}

/** A rejected PATCH must roll the status back. */
function StatusChangeHarness() {
  const listId = 'list-1';
  const updateTask = useUpdateTask(listId, 'all');
  const details = useListDetails(listId, 'all');

  if (!details.data) return null;

  return (
    <TasksTable
      tasks={details.data.tasks}
      now={now}
      loading={false}
      onStatusChange={(taskId, status) => updateTask.mutate({ id: taskId, patch: { status } })}
      onOpenTask={fn()}
      onDeleteTask={fn()}
    />
  );
}

export const RevertsStatusOnFailure: Story = {
  parameters: {
    msw: {
      handlers: [
        // Story handlers replace the global ones. Refetches are delayed past the
        // assertion window, so only the onError rollback can make it pass.
        (() => {
          let calls = 0;
          return http.get('/api/lists/:id', async () => {
            calls += 1;
            if (calls > 1) await delay(900);
            return HttpResponse.json({
              list: mockList,
              tasks: mockTasks,
              stats: mockListsWithStats[0]!.stats,
            });
          });
        })(),
        // Delayed so the optimistic status is visible before the failure.
        http.patch('/api/tasks/:id', async () => {
          await delay(200);
          return HttpResponse.json({ error: 'Сервер недоступен' }, { status: 500 });
        }),
      ],
    },
  },
  render: () => <StatusChangeHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const screen = within(canvasElement.ownerDocument.body);
    const statusField = () => canvas.getByLabelText('Статус задачи «Подключить аналитику»');

    await waitFor(() => expect(statusField()).toHaveTextContent('Новая'));

    await userEvent.click(statusField());
    await userEvent.click(await screen.findByRole('option', { name: 'Выполнена' }));

    await waitFor(() => expect(statusField()).toHaveTextContent('Выполнена'));

    // Must roll back well before the delayed refetch.
    await waitFor(() => expect(statusField()).toHaveTextContent('Новая'), { timeout: 500 });
  },
};

export const ClearsDeadlineOptimistically: Story = {
  parameters: {
    // Delayed response: only the optimistic cache update can pass the assertion.
    msw: {
      handlers: [
        // Story handlers replace the global ones, so the list GET is repeated here.
        http.get('/api/lists/:id', () =>
          HttpResponse.json({
            list: mockList,
            tasks: mockTasks,
            stats: mockListsWithStats[0]!.stats,
          }),
        ),
        http.patch('/api/tasks/:id', async ({ params, request }) => {
          await delay(800);
          const body = (await request.json()) as Record<string, unknown>;
          const task = mockTasks.find((item) => item.id === params.id) ?? mockTasks[0]!;
          return HttpResponse.json({ task: { ...task, ...body } });
        }),
      ],
    },
  },
  render: () => <ClearDeadlineHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = await canvas.findByRole('row', { name: /Свёрстать главный экран/ });

    await expect(within(row).queryByText('Без дедлайна')).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Очистить дедлайн' }));

    await waitFor(() => expect(within(row).getByText('Без дедлайна')).toBeInTheDocument(), {
      timeout: 500,
    });
  },
};
