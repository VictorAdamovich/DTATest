'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  parseTaskFilter,
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
  type Task,
} from '@/entities/task';
import { useListDetails } from '@/entities/task-list';
import { ConfirmDeleteDialog } from '@/features/confirm-delete';
import { TaskStatusFilter } from '@/features/filter-tasks';
import { ROUTES } from '@/shared/config/routes';
import { errorMessage } from '@/shared/lib/error-message';
import { TaskDialog, type TaskFormValues } from '@/widgets/task-dialog';
import { TasksTable } from '@/widgets/tasks-table';

type TaskDialogState =
  { kind: 'closed' } | { kind: 'create' } | { kind: 'edit'; task: Task } | { kind: 'not-found' };

/** `?task=new` opens the create form; `?task=<id>` may point to a deleted or filtered-out task. */
function resolveTaskDialog(taskParam: string | null, tasks: Task[] | undefined): TaskDialogState {
  if (taskParam === null) return { kind: 'closed' };
  if (taskParam === 'new') return { kind: 'create' };
  if (!tasks) return { kind: 'closed' };

  const task = tasks.find((item) => item.id === taskParam);
  return task ? { kind: 'edit', task } : { kind: 'not-found' };
}

export function ListDetailPage({ listId }: { listId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = parseTaskFilter(searchParams.get('status'));
  const now = useMemo(() => new Date(), []);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const details = useListDetails(listId, filter);
  const createTask = useCreateTask(listId);
  const updateTask = useUpdateTask(listId, filter);
  const deleteTask = useDeleteTask();

  const list = details.data?.list;
  const stats = details.data?.stats;
  const taskDialog = resolveTaskDialog(searchParams.get('task'), details.data?.tasks);
  const editedTask = taskDialog.kind === 'edit' ? taskDialog.task : null;

  const setSearchParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);

    const query = params.toString();
    router.replace(query ? `${ROUTES.list(listId)}?${query}` : ROUTES.list(listId), {
      scroll: false,
    });
  };

  const closeTaskDialog = () => {
    setSearchParam('task', null);
    createTask.reset();
    updateTask.reset();
  };

  const closeDeleteDialog = () => {
    setTaskToDelete(null);
    deleteTask.reset();
  };

  const saveTask = (values: TaskFormValues) => {
    if (editedTask) {
      updateTask.mutate({ id: editedTask.id, patch: values }, { onSuccess: closeTaskDialog });
    } else {
      const dueDate = values.dueDate ?? undefined;
      createTask.mutate({ ...values, dueDate }, { onSuccess: closeTaskDialog });
    }
  };

  return (
    <Stack spacing={3}>
      <Breadcrumbs>
        <Link href={ROUTES.lists}>Списки</Link>
        <Typography color="text.primary">{list?.title ?? '…'}</Typography>
      </Breadcrumbs>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' } }}
      >
        <Typography variant="h1" sx={{ flexGrow: 1 }}>
          {list?.title ?? 'Загрузка…'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setSearchParam('task', 'new')}
        >
          Новая задача
        </Button>
      </Stack>

      {stats && (
        <Stack spacing={0.5}>
          <LinearProgress variant="determinate" value={Math.round(stats.progress * 100)} />
          <Typography variant="caption" color="text.secondary">
            Выполнено {stats.counts.done} из {stats.total} · просрочено {stats.counts.overdue}
          </Typography>
        </Stack>
      )}

      <TaskStatusFilter
        value={filter}
        onChange={(next) => setSearchParam('status', next === 'all' ? null : next)}
      />

      {details.isError && <Alert severity="error">Не удалось загрузить задачи</Alert>}
      {taskDialog.kind === 'not-found' && (
        <Alert severity="warning" onClose={() => setSearchParam('task', null)}>
          Задача не найдена — возможно, она была удалена или скрыта текущим фильтром.
        </Alert>
      )}

      <TasksTable
        tasks={details.data?.tasks ?? []}
        now={now}
        loading={details.isPending}
        onStatusChange={(taskId, status) => updateTask.mutate({ id: taskId, patch: { status } })}
        onOpenTask={(taskId) => setSearchParam('task', taskId)}
        onDeleteTask={setTaskToDelete}
      />

      <ConfirmDeleteDialog
        open={taskToDelete !== null}
        title="Удалить задачу?"
        description={
          taskToDelete ? `Задача «${taskToDelete.title}» будет удалена безвозвратно.` : ''
        }
        error={errorMessage(deleteTask.error)}
        onClose={closeDeleteDialog}
        onConfirm={() => {
          if (taskToDelete) deleteTask.mutate(taskToDelete.id, { onSuccess: closeDeleteDialog });
        }}
      />

      <TaskDialog
        open={taskDialog.kind === 'create' || taskDialog.kind === 'edit'}
        task={editedTask}
        pending={createTask.isPending || updateTask.isPending}
        error={errorMessage(editedTask ? updateTask.error : createTask.error)}
        onClose={closeTaskDialog}
        onSubmit={saveTask}
      />
    </Stack>
  );
}
