import { describe, expect, it } from 'vitest';
import { ApiError } from '../errors';
import { login } from './auth.controller';

describe('login', () => {
  it('возвращает пользователя для верных кредов', () => {
    expect(login({ email: 'admin@example.com', password: 'Admin123!' }).email).toBe(
      'admin@example.com',
    );
  });

  it('бросает 401 при неверном пароле', () => {
    expect(() => login({ email: 'admin@example.com', password: 'WrongPass1' })).toThrowError(
      ApiError,
    );
    try {
      login({ email: 'admin@example.com', password: 'WrongPass1' });
    } catch (error) {
      expect((error as ApiError).status).toBe(401);
      expect((error as ApiError).message).toBe('Неверный email или пароль');
    }
  });

  it('бросает 400 при невалидном теле запроса', () => {
    try {
      login({ email: 'admin', password: '1' });
    } catch (error) {
      expect((error as ApiError).status).toBe(400);
    }
  });
});
