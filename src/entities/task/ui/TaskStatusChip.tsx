import Chip from '@mui/material/Chip';
import type { TaskStatus } from '../model/types';

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Выполнена',
};

const COLORS: Record<TaskStatus, 'default' | 'info' | 'success'> = {
  new: 'default',
  in_progress: 'info',
  done: 'success',
};

export function TaskStatusChip({ status }: { status: TaskStatus }) {
  return (
    <Chip
      size="small"
      variant="outlined"
      color={COLORS[status]}
      label={TASK_STATUS_LABELS[status]}
    />
  );
}
