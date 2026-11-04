import Link from 'next/link';

import { Icon } from '../ui/icon';

function BrandMark() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="currentColor"
      aria-hidden="true"
      className="size-10 text-accent sm:size-11"
    >
      <path
        fillRule="evenodd"
        d="M24 3a21 21 0 1 0 15.4 35.3l6 3.1-2.8-8A21 21 0 0 0 24 3ZM24 8a5 5 0 1 1 0 10 5 5 0 0 1 0-10ZM8 24a5 5 0 1 1 10 0 5 5 0 0 1-10 0Zm16 6a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm6-6a5 5 0 1 1 10 0 5 5 0 0 1-10 0Zm-6-2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between gap-4 border-b border-white/5 bg-background/85 px-5 py-6 sm:px-9 lg:px-12">
      <Link
        href="/"
        aria-label="CineVerse — página inicial"
        className="flex shrink-0 items-center gap-2.5 rounded-lg"
      >
        <BrandMark />
        <span className="text-2xl font-bold tracking-tight sm:text-3xl">
          Cine<span className="text-accent">Verse</span>
        </span>
      </Link>
      <nav
        aria-label="Navegação principal"
        className="flex items-center gap-2 sm:gap-5"
      >
        <Link
          href="/"
          aria-current="page"
          className="rounded-full border border-accent/15 bg-[#351666] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#482184] sm:px-6"
        >
          Home
        </Link>
        <button
          type="button"
          disabled
          title="Meus filmes — em breve"
          className="hidden px-1 py-2 text-sm text-muted disabled:cursor-default sm:block"
        >
          Meus Filmes <span className="sr-only">(em breve)</span>
        </button>
        <span
          title="Perfil — em breve"
          className="hidden size-9 items-center justify-center rounded-full border border-[#686074] bg-[#292331] text-[#bbb0ca] sm:flex"
        >
          <Icon name="user" className="size-6" />
          <span className="sr-only">Perfil em breve</span>
        </span>
      </nav>
    </header>
  );
}
