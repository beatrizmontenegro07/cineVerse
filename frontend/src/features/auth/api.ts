import { requestJson, writeOptions } from '../../lib/api';
import type { Credentials, Registration, User } from './types';

function isSession(value: unknown): value is { user: User | null } {
  if (!value || typeof value !== 'object') return false;
  const user = (value as { user?: User }).user;
  return (
    user === null ||
    (!!user &&
      typeof user.id === 'number' &&
      typeof user.username === 'string' &&
      typeof user.email === 'string')
  );
}

export async function getSession(signal: AbortSignal) {
  return (await requestJson('/api/auth/me/', isSession, { signal })).user;
}

async function authenticate(path: string, data: Credentials | Registration) {
  const response = await requestJson(
    path,
    isSession,
    await writeOptions('POST', new AbortController().signal, data),
  );
  if (!response.user)
    throw new Error('Não foi possível entrar na conta. Tente novamente.');
  return response.user;
}

export const login = (data: Credentials) =>
  authenticate('/api/auth/login/', data);
export const register = (data: Registration) =>
  authenticate('/api/auth/register/', data);
export async function logout() {
  await requestJson(
    '/api/auth/logout/',
    isSession,
    await writeOptions('POST', new AbortController().signal),
  );
}
