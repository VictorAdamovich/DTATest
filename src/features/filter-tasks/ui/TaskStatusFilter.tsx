'use client';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { TaskFilter } from '@/entities/task';

const OPTIONS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'new', label: 'Новые' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'done', label: 'Выполненные' },
  { value: 'overdue', label: 'Просроченные' },
];

export function TaskStatusFilter({
  value,
  onChange,
}: {
  value: TaskFilter;
  onChange: (filter: TaskFilter) => void;
}) {
  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={value}
      onChange={(_event, next: TaskFilter | null) => next && onChange(next)}
      aria-label="Фильтр по статусу"
    >
      {OPTIONS.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
