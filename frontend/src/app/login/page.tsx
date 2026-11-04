import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AppShell } from '../../components/layout/app-shell';
import { AuthForm } from '../../features/auth/components/auth-form';

export const metadata: Metadata = { title: 'Entrar | CineVerse' };

export default function LoginPage() {
  return (
    <AppShell>
      <Suspense fallback={<p className="p-5 text-muted">Carregando…</p>}>
        <AuthForm mode="login" />
      </Suspense>
    </AppShell>
  );
}
