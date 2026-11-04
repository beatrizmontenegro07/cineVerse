'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import type { ReactNode } from 'react';

import { useAuth } from '../auth-provider';

export function AuthRequired({
  children,
  message = 'Entre na sua conta para avaliar este filme.',
}: {
  children: ReactNode;
  message?: string;
}) {
  const { user, status, retry } = useAuth();
  const pathname = usePathname();
  if (status === 'loading')
    return (
      <p role="status" className="p-5 text-sm text-muted">
        Verificando sua conta…
      </p>
    );
  if (status === 'error')
    return (
      <div role="alert" className="p-5 text-sm text-muted">
        <p>Não foi possível verificar sua conta.</p>
        <button
          type="button"
          onClick={retry}
          className="mt-3 rounded text-accent underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  if (!user)
    return (
      <div className="p-5 text-sm text-muted">
        <p>{message}</p>
        <Link
          href={`/login?next=${encodeURIComponent(pathname)}`}
          className="mt-4 inline-flex rounded-full border border-accent/60 px-5 py-2.5 font-medium text-[#c59aff] hover:bg-accent/10"
        >
          Entrar na conta
        </Link>
      </div>
    );
  return <Fragment key={user.id}>{children}</Fragment>;
}
