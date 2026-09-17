'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { loginSchema, type LoginInput, type User } from '@/entities/session';
import { apiFetch } from '@/shared/api/http';
import { errorMessage } from '@/shared/lib/error-message';

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: (input: LoginInput) =>
      apiFetch<{ user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: () => onSuccess?.(),
  });

  return (
    <Box component="form" noValidate onSubmit={handleSubmit((values) => mutation.mutate(values))}>
      <Stack spacing={2} sx={{ width: 320 }}>
        <TextField
          label="Email"
          autoComplete="email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label="Пароль"
          type="password"
          autoComplete="current-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register('password')}
        />
        {mutation.isError && <Alert severity="error">{errorMessage(mutation.error)}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
          {mutation.isPending ? 'Входим…' : 'Войти'}
        </Button>
      </Stack>
    </Box>
  );
}
