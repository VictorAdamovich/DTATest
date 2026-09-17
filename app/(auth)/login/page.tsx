import { redirect } from 'next/navigation';
import { getSession } from '@/server/session';
import { ROUTES } from '@/shared/config/routes';
import { LoginPage } from '@/views/login-page';

export default async function Page() {
  if (await getSession()) redirect(ROUTES.lists);
  return <LoginPage />;
}
