export const ROUTES = {
  login: '/login',
  lists: '/lists',
  list: (id: string) => `/lists/${id}`,
} as const;
