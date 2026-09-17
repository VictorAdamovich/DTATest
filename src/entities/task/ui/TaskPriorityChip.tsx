import Chip from '@mui/material/Chip';
import type { Priority } from '../model/types';

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

const COLORS: Record<Priority, 'default' | 'warning' | 'error'> = {
  low: 'default',
  medium: 'warning',
  high: 'error',
};

export function TaskPriorityChip({ priority }: { priority: Priority }) {
  return <Chip size="small" color={COLORS[priority]} label={PRIORITY_LABELS[priority]} />;
}
