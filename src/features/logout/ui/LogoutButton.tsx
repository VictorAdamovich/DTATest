'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import Button from '@mui/material/Button';
import { apiFetch } from '@/shared/api/http';
import { ROUTES } from '@/shared/config/routes';

export function LogoutButton() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => apiFetch<void>('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      router.replace(ROUTES.login);
      router.refresh();
    },
  });

  return (
    <Button color="inherit" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      Выйти
    </Button>
  );
}
