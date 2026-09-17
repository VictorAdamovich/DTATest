import { describe, expect, it } from 'vitest';
import { loginSchema } from './schema';

describe('loginSchema', () => {
  it('принимает валидную пару email и пароля', () => {
    const result = loginSchema.safeParse({ email: 'admin@example.com', password: 'Admin123!' });
    expect(result.success).toBe(true);
  });

  it('отклоняет некорректный email с русским сообщением', () => {
    const result = loginSchema.safeParse({ email: 'admin', password: 'Admin123!' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Введите корректный email');
  });

  it('отклоняет пароль короче восьми символов', () => {
    const result = loginSchema.safeParse({ email: 'admin@example.com', password: 'Adm1!' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Минимум 8 символов');
  });
});
