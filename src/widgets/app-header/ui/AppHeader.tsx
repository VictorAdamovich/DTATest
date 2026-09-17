'use client';

import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import type { User } from '@/entities/session';
import { LogoutButton } from '@/features/logout';
import { ThemeSwitcher } from '@/features/theme-switcher';
import { ROUTES } from '@/shared/config/routes';

export function AppHeader({ user }: { user: User }) {
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          component={Link}
          href={ROUTES.lists}
          variant="h6"
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
        >
          Менеджер задач
        </Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {user.email}
          </Typography>
          <ThemeSwitcher />
          <LogoutButton />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
