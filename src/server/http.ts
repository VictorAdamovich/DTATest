import { NextResponse } from 'next/server';
import { ApiError } from './errors';
import { requireSession } from './session';

type Params = Record<string, string>;

/** `ApiError` keeps its status; anything else becomes a 500. */
export function publicRoute<Context>(
  handler: (request: Request, context: Context) => Promise<Response>,
) {
  return async (request: Request, context: Context): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      console.error(error);
      return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
  };
}

export function protectedRoute<P extends Params = Params>(
  handler: (request: Request, params: P) => Promise<Response> | Response,
) {
  return publicRoute(async (request, context: { params: Promise<P> }) => {
    await requireSession();
    return handler(request, await context.params);
  });
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, 'Некорректный JSON');
  }
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}
