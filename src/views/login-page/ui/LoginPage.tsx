'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LoginForm } from '@/features/login';
import { ThemeSwitcher } from '@/features/theme-switcher';
import { ROUTES } from '@/shared/config/routes';

export function LoginPage() {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Card sx={{ width: 'min(100%, 400px)' }}>
        <CardContent>
          <Stack spacing={3}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h1">Вход</Typography>
              <ThemeSwitcher />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Демо-доступ: admin@example.com / Admin123!
            </Typography>
            <LoginForm
              onSuccess={() => {
                router.replace(ROUTES.lists);
                router.refresh();
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
