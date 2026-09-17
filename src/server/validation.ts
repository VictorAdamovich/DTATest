import type { z } from 'zod';
import { ApiError } from './errors';

/** Throws a 400 with the schema's first message if the input is invalid. */
export function parseInput<Schema extends z.ZodType>(
  schema: Schema,
  input: unknown,
): z.output<Schema> {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ApiError(400, result.error.issues[0]?.message ?? 'Некорректные данные');
  }
  return result.data;
}
