'use client';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { TaskListCard, type ListWithStats } from '@/entities/task-list';

const cardGridSx = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
};

type Props = {
  lists: ListWithStats[];
  query: string;
  loading: boolean;
  /** The page shows the error; the grid only hides its empty state. */
  error?: boolean;
  onQueryChange: (value: string) => void;
  onCreate: () => void;
  onRename: (list: ListWithStats) => void;
  onDelete: (list: ListWithStats) => void;
};

export function ListsGrid({ query, onQueryChange, onCreate, ...contentProps }: Props) {
  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' } }}
      >
        <Typography variant="h1" sx={{ flexGrow: 1 }}>
          Списки задач
        </Typography>
        <TextField
          size="small"
          label="Поиск списков"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          sx={{ minWidth: 240 }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
          Новый список
        </Button>
      </Stack>

      <GridContent query={query} {...contentProps} />
    </Stack>
  );
}

function GridContent({
  lists,
  query,
  loading,
  error,
  onRename,
  onDelete,
}: Omit<Props, 'onQueryChange' | 'onCreate'>) {
  if (loading) {
    return (
      <Box sx={cardGridSx}>
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} variant="rounded" height={160} />
        ))}
      </Box>
    );
  }

  if (lists.length > 0) {
    return (
      <Box sx={cardGridSx}>
        {lists.map((list) => (
          <TaskListCard
            key={list.id}
            list={list}
            onRename={() => onRename(list)}
            onDelete={() => onDelete(list)}
          />
        ))}
      </Box>
    );
  }

  if (error) return null;

  return (
    <Typography color="text.secondary">
      {query
        ? 'Ничего не найдено — попробуйте изменить запрос.'
        : 'Списков пока нет. Создайте первый.'}
    </Typography>
  );
}
