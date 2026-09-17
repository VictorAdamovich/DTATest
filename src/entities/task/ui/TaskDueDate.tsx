'use client';

import { useSyncExternalStore } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatDueDate } from '@/shared/lib/format';
import { isDueSoon, isOverdue } from '../model/status';
import type { Task } from '../model/types';

// The formatted date never changes, so there is nothing to subscribe to.
const subscribeToNothing = () => () => {};

function deadlineColor(overdue: boolean, dueSoon: boolean) {
  if (overdue) return 'error.main';
  if (dueSoon) return 'warning.main';
  return 'text.primary';
}

/** The server doesn't know the viewer's time zone, so the date renders after hydration. */
function useLocalDueDate(iso: string): string | null {
  return useSyncExternalStore(
    subscribeToNothing,
    () => formatDueDate(iso),
    () => null,
  );
}

export function TaskDueDate({ task, now }: { task: Task; now: Date }) {
  if (!task.dueDate) {
    return (
      <Typography variant="body2" color="text.secondary">
        Без дедлайна
      </Typography>
    );
  }

  return <DueDate task={task} dueDate={task.dueDate} now={now} />;
}

function DueDate({ task, dueDate, now }: { task: Task; dueDate: string; now: Date }) {
  const formatted = useLocalDueDate(dueDate);
  const overdue = isOverdue(task, now);
  const color = deadlineColor(overdue, isDueSoon(task, now));

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Typography variant="body2" color={color}>
        {formatted}
      </Typography>
      {overdue && (
        <Typography variant="caption" color="error.main">
          Просрочено
        </Typography>
      )}
    </Stack>
  );
}
