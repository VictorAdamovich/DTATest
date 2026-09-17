'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Task, TaskFilter } from '@/entities/task/@x/task-list';
import { apiFetch } from '@/shared/api/http';
import { queryKeys } from '@/shared/api/query-keys';
import type { ListStats, ListWithStats, TaskList } from '../model/types';

export type ListDetailsResponse = { list: TaskList; tasks: Task[]; stats: ListStats };

export function useLists(query: string) {
  return useQuery({
    queryKey: queryKeys.lists(query),
    queryFn: async () => {
      const { lists } = await apiFetch<{ lists: ListWithStats[] }>(
        `/api/lists?q=${encodeURIComponent(query)}`,
      );
      return lists;
    },
  });
}

export function useListDetails(listId: string, filter: TaskFilter) {
  return useQuery({
    queryKey: queryKeys.list(listId, filter),
    queryFn: () => apiFetch<ListDetailsResponse>(`/api/lists/${listId}?status=${filter}`),
  });
}

function useInvalidateLists() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.all });
}

export function useCreateList() {
  const invalidateLists = useInvalidateLists();
  return useMutation({
    mutationFn: (title: string) =>
      apiFetch<{ list: TaskList }>('/api/lists', {
        method: 'POST',
        body: JSON.stringify({ title }),
      }),
    onSuccess: invalidateLists,
  });
}

export function useRenameList() {
  const invalidateLists = useInvalidateLists();
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      apiFetch<{ list: TaskList }>(`/api/lists/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title }),
      }),
    onSuccess: invalidateLists,
  });
}

export function useDeleteList() {
  const invalidateLists = useInvalidateLists();
  return useMutation({
    mutationFn: (id: string) => apiFetch<void>(`/api/lists/${id}`, { method: 'DELETE' }),
    onSuccess: invalidateLists,
  });
}
