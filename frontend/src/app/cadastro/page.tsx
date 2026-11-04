import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AppShell } from '../../components/layout/app-shell';
import { AuthForm } from '../../features/auth/components/auth-form';

export const metadata: Metadata = { title: 'Criar conta | CineVerse' };

export default function RegisterPage() {
  return (
    <AppShell>
      <Suspense fallback={<p className="p-5 text-muted">Carregando…</p>}>
        <AuthForm mode="register" />
      </Suspense>
    </AppShell>
  );
}
