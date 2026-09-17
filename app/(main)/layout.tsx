import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Container from '@mui/material/Container';
import { getSession } from '@/server/session';
import { ROUTES } from '@/shared/config/routes';
import { AppHeader } from '@/widgets/app-header';

export default async function MainLayout({ children }: { children: ReactNode }) {
  const user = await getSession();
  if (!user) redirect(ROUTES.login);

  return (
    <>
      <AppHeader user={user} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </>
  );
}
