'use client';

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { TaskDueDate, TaskPriorityChip, type Task, type TaskStatus } from '@/entities/task';
import { TaskStatusSelect } from '@/features/change-task-status';

type Props = {
  tasks: Task[];
  now: Date;
  loading: boolean;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onOpenTask: (taskId: string) => void;
  onDeleteTask: (task: Task) => void;
};

export function TasksTable({
  tasks,
  now,
  loading,
  onStatusChange,
  onOpenTask,
  onDeleteTask,
}: Props) {
  if (loading) return <Skeleton variant="rounded" height={240} />;

  if (tasks.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4 }}>
        Задач с таким фильтром нет.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
      <Table size="small" aria-label="Задачи списка">
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Приоритет</TableCell>
            <TableCell>Дедлайн</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} hover>
              <TableCell sx={{ maxWidth: 320 }}>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={() => onOpenTask(task.id)}
                  sx={{ textAlign: 'start' }}
                >
                  {task.title}
                </Button>
              </TableCell>
              <TableCell>
                <TaskStatusSelect
                  value={task.status}
                  taskTitle={task.title}
                  onChange={(status) => onStatusChange(task.id, status)}
                />
              </TableCell>
              <TableCell>
                <TaskPriorityChip priority={task.priority} />
              </TableCell>
              <TableCell>
                <TaskDueDate task={task} now={now} />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  aria-label={`Удалить задачу «${task.title}»`}
                  onClick={() => onDeleteTask(task)}
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
