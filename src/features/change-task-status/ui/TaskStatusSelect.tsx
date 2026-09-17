'use client';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { TASK_STATUSES, TASK_STATUS_LABELS, type TaskStatus } from '@/entities/task';

type Props = {
  value: TaskStatus;
  taskTitle: string;
  disabled?: boolean;
  onChange: (status: TaskStatus) => void;
};

export function TaskStatusSelect({ value, taskTitle, disabled, onChange }: Props) {
  return (
    <TextField
      select
      size="small"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as TaskStatus)}
      slotProps={{ htmlInput: { 'aria-label': `Статус задачи «${taskTitle}»` } }}
      sx={{ minWidth: 150 }}
    >
      {TASK_STATUSES.map((status) => (
        <MenuItem key={status} value={status}>
          {TASK_STATUS_LABELS[status]}
        </MenuItem>
      ))}
    </TextField>
  );
}
