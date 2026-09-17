'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/shared/api/http';
import { queryKeys } from '@/shared/api/query-keys';
import type { Task, TaskFilter } from '../model/types';

type EditableFields = Omit<Task, 'id' | 'listId' | 'createdAt' | 'updatedAt' | 'dueDate'>;

/** `dueDate: null` clears the deadline; omit it to keep the current one. */
export type TaskPayload = Partial<EditableFields> & { dueDate?: string | null };

type CachedListPage = { tasks: Task[] };

function applyPatch(task: Task, patch: TaskPayload): Task {
  // Check the key, not `??`: an explicit null must clear the deadline.
  const dueDate = 'dueDate' in patch ? (patch.dueDate ?? undefined) : task.dueDate;
  return { ...task, ...patch, dueDate };
}

export function useUpdateTask(listId: string, filter: TaskFilter) {
  const queryClient = useQueryClient();
  const pageKey = queryKeys.list(listId, filter);

  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: TaskPayload }) =>
      apiFetch<{ task: Task }>(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      }),

    // Optimistic update.
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: pageKey });
      const previous = queryClient.getQueryData<CachedListPage>(pageKey);

      if (previous) {
        queryClient.setQueryData<CachedListPage>(pageKey, {
          ...previous,
          tasks: previous.tasks.map((task) => (task.id === id ? applyPatch(task, patch) : task)),
        });
      }

      return { previous };
    },

    // Roll back if the server rejects the change.
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(pageKey, context.previous);
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.all }),
  });
}

export function useCreateTask(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TaskPayload & { title: string }) =>
      apiFetch<{ task: Task }>(`/api/lists/${listId}/tasks`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.all }),
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => apiFetch<void>(`/api/tasks/${taskId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.all }),
  });
}
