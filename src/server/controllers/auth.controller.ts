import { loginSchema, type User } from '@/entities/session';
import { ApiError } from '../errors';
import { DEMO_PASSWORD, DEMO_USER } from '../session';
import { parseInput } from '../validation';

export function login(input: unknown): User {
  const { email, password } = parseInput(loginSchema, input);

  if (email.toLowerCase() !== DEMO_USER.email || password !== DEMO_PASSWORD) {
    throw new ApiError(401, 'Неверный email или пароль');
  }

  return DEMO_USER;
}
