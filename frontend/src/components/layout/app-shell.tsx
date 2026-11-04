import type { ReactNode } from 'react';

import { SiteHeader } from './site-header';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-50 -translate-y-24 rounded-lg bg-accent px-4 py-3 font-semibold text-black focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <div className="flex min-h-dvh w-full flex-col overflow-hidden bg-background">
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <footer className="mx-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/6 py-5 text-xs text-[#8c829b] sm:mx-9 lg:mx-12">
          <p>CineVerse</p>
          <p>
            Dados fornecidos pelo{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
              className="rounded-sm text-[#b9a6cf] underline-offset-4 hover:underline"
            >
              TMDB
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
