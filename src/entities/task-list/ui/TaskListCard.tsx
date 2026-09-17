import Link from 'next/link';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ROUTES } from '@/shared/config/routes';
import type { ListIndicator, ListWithStats } from '../model/types';

const INDICATOR_COLOR: Record<ListIndicator, string> = {
  red: 'error.main',
  yellow: 'warning.main',
  none: 'transparent',
};

const INDICATOR_LABEL: Record<ListIndicator, string> = {
  red: 'Есть просроченные задачи',
  yellow: 'Дедлайн в ближайшие 48 часов',
  none: 'Срочных дедлайнов нет',
};

export function TaskListCard({
  list,
  onRename,
  onDelete,
}: {
  list: ListWithStats;
  onRename: () => void;
  onDelete: () => void;
}) {
  const { counts, total, progress, indicator } = list.stats;
  const percent = Math.round(progress * 100);

  return (
    <Card sx={{ position: 'relative', overflow: 'hidden', height: '100%' }}>
      <Box
        role="img"
        aria-label={INDICATOR_LABEL[indicator]}
        sx={{
          position: 'absolute',
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: INDICATOR_COLOR[indicator],
        }}
      />
      <CardActionArea component={Link} href={ROUTES.list(list.id)} sx={{ p: 0 }}>
        <CardContent sx={{ pl: 3 }}>
          <Stack spacing={1.5}>
            <Typography variant="h2" noWrap title={list.title}>
              {list.title}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              <Chip size="small" variant="outlined" label={`Новые: ${counts.new}`} />
              <Chip
                size="small"
                variant="outlined"
                color="info"
                label={`В работе: ${counts.in_progress}`}
              />
              <Chip
                size="small"
                variant="outlined"
                color="success"
                label={`Выполнено: ${counts.done}`}
              />
              <Chip size="small" color="error" label={`Просрочено: ${counts.overdue}`} />
            </Stack>
            <Box>
              <LinearProgress
                variant="determinate"
                value={percent}
                aria-label={`Прогресс списка ${list.title}`}
              />
              <Typography variant="caption" color="text.secondary">
                {total === 0 ? 'Задач пока нет' : `${counts.done} из ${total} · ${percent}%`}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
      <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 8, insetInlineEnd: 8 }}>
        <IconButton
          size="small"
          aria-label={`Переименовать список ${list.title}`}
          onClick={onRename}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" aria-label={`Удалить список ${list.title}`} onClick={onDelete}>
          <DeleteOutlinedIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Card>
  );
}
