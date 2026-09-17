import { noContent, publicRoute } from '@/server/http';
import { SESSION_COOKIE } from '@/server/session';

export const POST = publicRoute(async () => {
  const response = noContent();
  response.cookies.delete(SESSION_COOKIE);
  return response;
});
