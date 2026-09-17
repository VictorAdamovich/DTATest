export function errorMessage(error: unknown): string | undefined {
  return error instanceof Error ? error.message : undefined;
}
