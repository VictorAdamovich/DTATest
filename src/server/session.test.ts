import { describe, expect, it } from 'vitest';
import { signSession, verifySession } from './session';

describe('session token', () => {
  it('подписывает и разбирает токен', () => {
    const token = signSession('admin@example.com');
    expect(verifySession(token)).toEqual({ email: 'admin@example.com' });
  });

  it('отвергает токен с подменённой подписью', () => {
    const token = signSession('admin@example.com');
    const tampered = `${token.split('.')[0]}.deadbeef`;
    expect(verifySession(tampered)).toBeNull();
  });

  it('отвергает мусор вместо токена', () => {
    expect(verifySession('not-a-token')).toBeNull();
  });

  it('отвергает токен с подписью верной длины, но неверным содержимым', () => {
    const token = signSession('admin@example.com');
    const [payload, signature] = token.split('.');
    const flipped = (signature![0] === 'a' ? 'b' : 'a') + signature!.slice(1);
    expect(flipped).toHaveLength(signature!.length);
    expect(verifySession(`${payload}.${flipped}`)).toBeNull();
  });

  it('отвергает токен с лишними сегментами', () => {
    const token = signSession('admin@example.com');
    expect(verifySession(`${token}.garbage`)).toBeNull();
  });
});
