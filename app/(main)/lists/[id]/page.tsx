import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { parseTaskFilter, type TaskFilter } from '@/entities/task';
import { getListDetails, type ListDetails } from '@/server/controllers/lists.controller';
import { ApiError } from '@/server/errors';
import { getSession } from '@/server/session';
import { queryKeys } from '@/shared/api/query-keys';
import { ROUTES } from '@/shared/config/routes';
import { ListDetailPage } from '@/views/list-detail-page';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function readListDetails(id: string, filter: TaskFilter): ListDetails | null {
  try {
    return getListDetails(id, { filter, now: new Date() });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export default async function Page({ params, searchParams }: Props) {
  // The layout guard doesn't protect page data: segments render independently.
  if (!(await getSession())) redirect(ROUTES.login);

  const { id } = await params;
  const { status } = await searchParams;
  const filter = parseTaskFilter((Array.isArray(status) ? status[0] : status) ?? null);

  const details = readListDetails(id, filter);
  if (!details) notFound();

  // Same key as useListDetails, so the client doesn't refetch after hydration.
  const queryClient = new QueryClient();
  queryClient.setQueryData(queryKeys.list(id, filter), details);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <ListDetailPage listId={id} />
      </Suspense>
    </HydrationBoundary>
  );
}
