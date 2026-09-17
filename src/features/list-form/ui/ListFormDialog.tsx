'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { listTitleSchema, type ListTitleInput } from '@/entities/task-list';

type Props = {
  open: boolean;
  title: string;
  submitLabel: string;
  initialValue?: string;
  pending?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (title: string) => void;
};

export function ListFormDialog({
  open,
  title,
  submitLabel,
  initialValue = '',
  pending,
  error,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ListTitleInput>({
    resolver: zodResolver(listTitleSchema),
    defaultValues: { title: initialValue },
  });

  useEffect(() => {
    if (open) reset({ title: initialValue });
  }, [open, initialValue, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form noValidate onSubmit={handleSubmit((values) => onSubmit(values.title))}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Название списка"
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
            {...register('title')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={pending}>
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
