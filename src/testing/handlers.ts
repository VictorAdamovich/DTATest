import { HttpResponse, http } from 'msw';
import { mockList, mockListsWithStats, mockTasks, mockUser } from './mocks';

export const handlers = [
  http.post('/api/auth/login', () => HttpResponse.json({ user: mockUser })),
  http.post('/api/auth/logout', () => new HttpResponse(null, { status: 204 })),
  http.get('/api/auth/me', () => HttpResponse.json({ user: mockUser })),
  http.get('/api/lists', () => HttpResponse.json({ lists: mockListsWithStats })),
  http.post('/api/lists', async ({ request }) => {
    const body = (await request.json()) as { title: string };
    return HttpResponse.json(
      {
        list: {
          id: 'list-new',
          title: body.title,
          createdAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
      },
      { status: 201 },
    );
  }),
  http.get('/api/lists/:id', () =>
    HttpResponse.json({ list: mockList, tasks: mockTasks, stats: mockListsWithStats[0]!.stats }),
  ),
  http.patch('/api/lists/:id', async ({ request }) => {
    const body = (await request.json()) as { title: string };
    return HttpResponse.json({ list: { ...mockList, title: body.title } });
  }),
  http.delete('/api/lists/:id', () => new HttpResponse(null, { status: 204 })),
  http.post('/api/lists/:id/tasks', async ({ request }) => {
    const body = (await request.json()) as { title: string };
    return HttpResponse.json(
      { task: { ...mockTasks[0], id: 'task-new', title: body.title } },
      { status: 201 },
    );
  }),
  http.get('/api/tasks/:id', ({ params }) => {
    const task = mockTasks.find((item) => item.id === params.id) ?? mockTasks[0]!;
    return HttpResponse.json({ task });
  }),
  http.patch('/api/tasks/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const task = mockTasks.find((item) => item.id === params.id) ?? mockTasks[0]!;
    return HttpResponse.json({ task: { ...task, ...body } });
  }),
  http.delete('/api/tasks/:id', () => new HttpResponse(null, { status: 204 })),
];
