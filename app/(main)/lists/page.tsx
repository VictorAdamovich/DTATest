import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { listLists } from '@/server/controllers/lists.controller';
import { getSession } from '@/server/session';
import { queryKeys } from '@/shared/api/query-keys';
import { ROUTES } from '@/shared/config/routes';
import { ListsPage } from '@/views/lists-page';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  // The layout guard doesn't protect page data: segments render independently.
  if (!(await getSession())) redirect(ROUTES.login);

  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q) ?? '';

  // Same key as useLists, so the client doesn't refetch after hydration.
  const queryClient = new QueryClient();
  queryClient.setQueryData(queryKeys.lists(query), listLists({ query, now: new Date() }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <ListsPage />
      </Suspense>
    </HydrationBoundary>
  );
}
