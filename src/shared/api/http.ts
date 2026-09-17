const FALLBACK_ERROR = 'Что-то пошло не так';

/** The API reports errors as `{ error: string }`. */
function readErrorMessage(body: unknown): string {
  if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
    return body.error;
  }
  return FALLBACK_ERROR;
}

/** JSON fetch for our API; non-2xx responses throw with the server's message. */
export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { 'content-type': 'application/json', ...init?.headers },
  });

  if (response.status === 204) return undefined as T;

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new Error(readErrorMessage(body));

  return body as T;
}
