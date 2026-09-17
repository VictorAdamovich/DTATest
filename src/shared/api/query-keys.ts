export const queryKeys = {
  /** Prefix shared by every list query. */
  all: ['lists'] as const,
  lists: (query = '') => ['lists', { query }] as const,
  list: (id: string, filter = 'all') => ['lists', id, { filter }] as const,
};
