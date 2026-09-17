'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Alert from '@mui/material/Alert';
import {
  useCreateList,
  useDeleteList,
  useLists,
  useRenameList,
  type ListWithStats,
} from '@/entities/task-list';
import { ConfirmDeleteDialog } from '@/features/confirm-delete';
import { ListFormDialog } from '@/features/list-form';
import { ROUTES } from '@/shared/config/routes';
import { errorMessage } from '@/shared/lib/error-message';
import { useDebouncedValue } from '@/shared/lib/use-debounced-value';
import { ListsGrid } from '@/widgets/lists-grid';

type DialogState =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'rename'; list: ListWithStats }
  | { kind: 'delete'; list: ListWithStats };

export function ListsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const debouncedQuery = useDebouncedValue(query, 300);
  const [dialog, setDialog] = useState<DialogState>({ kind: 'closed' });

  const listsQuery = useLists(debouncedQuery);
  const createList = useCreateList();
  const renameList = useRenameList();
  const deleteList = useDeleteList();

  // Update the URL once typing pauses, not on every keystroke.
  useEffect(() => {
    const target = debouncedQuery
      ? `${ROUTES.lists}?q=${encodeURIComponent(debouncedQuery)}`
      : ROUTES.lists;
    router.replace(target, { scroll: false });
  }, [debouncedQuery, router]);

  const closeDialog = () => {
    setDialog({ kind: 'closed' });
    createList.reset();
    renameList.reset();
    deleteList.reset();
  };

  return (
    <>
      {listsQuery.isError && <Alert severity="error">Не удалось загрузить списки</Alert>}

      <ListsGrid
        lists={listsQuery.data ?? []}
        query={query}
        loading={listsQuery.isPending}
        error={listsQuery.isError}
        onQueryChange={setQuery}
        onCreate={() => setDialog({ kind: 'create' })}
        onRename={(list) => setDialog({ kind: 'rename', list })}
        onDelete={(list) => setDialog({ kind: 'delete', list })}
      />

      <ListFormDialog
        open={dialog.kind === 'create'}
        title="Новый список"
        submitLabel="Создать"
        pending={createList.isPending}
        error={errorMessage(createList.error)}
        onClose={closeDialog}
        onSubmit={(title) => createList.mutate(title, { onSuccess: closeDialog })}
      />

      <ListFormDialog
        open={dialog.kind === 'rename'}
        title="Переименовать список"
        submitLabel="Сохранить"
        initialValue={dialog.kind === 'rename' ? dialog.list.title : ''}
        pending={renameList.isPending}
        error={errorMessage(renameList.error)}
        onClose={closeDialog}
        onSubmit={(title) => {
          if (dialog.kind !== 'rename') return;
          renameList.mutate({ id: dialog.list.id, title }, { onSuccess: closeDialog });
        }}
      />

      <ConfirmDeleteDialog
        open={dialog.kind === 'delete'}
        title="Удалить список?"
        description={
          dialog.kind === 'delete'
            ? `Список «${dialog.list.title}» и все его задачи будут удалены безвозвратно.`
            : ''
        }
        error={errorMessage(deleteList.error)}
        onClose={closeDialog}
        onConfirm={() => {
          if (dialog.kind !== 'delete') return;
          deleteList.mutate(dialog.list.id, { onSuccess: closeDialog });
        }}
      />
    </>
  );
}
