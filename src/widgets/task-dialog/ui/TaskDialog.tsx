'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {
  PRIORITIES,
  PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  taskFormSchema,
  type Priority,
  type Task,
  type TaskFormShape,
  type TaskStatus,
} from '@/entities/task';
import { fromDateTimeLocal, toDateTimeLocal } from '@/shared/lib/datetime-local';

export type TaskFormValues = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  /** ISO string, or `null` when there is no deadline. */
  dueDate: string | null;
};

type Props = {
  open: boolean;
  /** `null` means a new task. */
  task: Task | null;
  pending?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
};

const EMPTY_FORM: TaskFormShape = {
  title: '',
  description: '',
  status: 'new',
  priority: 'medium',
  dueDateLocal: '',
};

function toFormValues(task: Task | null): TaskFormShape {
  if (!task) return EMPTY_FORM;

  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDateLocal: toDateTimeLocal(task.dueDate),
  };
}

export function TaskDialog({ open, task, pending, error, onClose, onSubmit }: Props) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormShape>({ resolver: zodResolver(taskFormSchema), defaultValues: EMPTY_FORM });

  // Reset on every open so a previous task's values don't leak in.
  useEffect(() => {
    if (open) reset(toFormValues(task));
  }, [open, task, reset]);

  const submit = handleSubmit(({ dueDateLocal, ...fields }) =>
    onSubmit({ ...fields, dueDate: fromDateTimeLocal(dueDateLocal) }),
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form noValidate onSubmit={submit}>
        <DialogTitle>{task ? 'Задача' : 'Новая задача'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="Название"
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
              {...register('title')}
            />
            <TextField label="Описание" multiline minRows={3} {...register('description')} />
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <TextField select label="Статус" {...field}>
                  {TASK_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {TASK_STATUS_LABELS[status]}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <TextField select label="Приоритет" {...field}>
                  {PRIORITIES.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {PRIORITY_LABELS[priority]}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <TextField
              type="datetime-local"
              label="Дедлайн"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('dueDateLocal')}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={pending}>
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
