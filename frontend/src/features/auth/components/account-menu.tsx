'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '../auth-provider';

export function AccountMenu() {
  const { user, status, logout, retry } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function leave() {
    setPending(true);
    setError('');
    try {
      await logout();
      router.push('/');
    } catch {
      setError('Não foi possível sair. Tente novamente.');
    } finally {
      setPending(false);
    }
  }
  if (status === 'loading')
    return (
      <span role="status" className="text-xs text-muted">
        Carregando conta…
      </span>
    );
  if (status === 'error')
    return (
      <button
        type="button"
        onClick={retry}
        className="rounded text-xs text-accent"
      >
        Verificar conta
      </button>
    );
  if (!user)
    return (
      <Link
        href="/login"
        className="rounded-full border border-accent/50 px-4 py-2 text-sm font-medium text-[#c59aff] hover:bg-accent/10"
      >
        Entrar
      </Link>
    );
  return (
    <div className="text-sm">
      <div className="flex items-center gap-3">
        <span
          className="max-w-24 truncate text-[#d9cce8]"
          title={user.username}
        >
          {user.username}
        </span>
        <button
          type="button"
          onClick={leave}
          disabled={pending}
          className="rounded text-muted hover:text-white disabled:opacity-50"
        >
          {pending ? 'Saindo…' : 'Sair'}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 max-w-48 text-xs text-[#e4b8ce]">
          {error}
        </p>
      )}
    </div>
  );
}
