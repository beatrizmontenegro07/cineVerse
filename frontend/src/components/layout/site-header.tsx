'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const links = [
    { href: '/', label: 'Home' },
    { href: '/meus-filmes', label: 'Meus Filmes' },
  ];
  return (
    <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 bg-background/85 px-5 py-6 sm:px-9 lg:px-12">
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
        className="flex w-full items-center gap-2 sm:w-auto sm:gap-5"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href ? 'page' : undefined}
            className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors sm:px-6 ${pathname === link.href ? 'border-accent/15 bg-[#351666] text-white hover:bg-[#482184]' : 'border-transparent text-muted hover:bg-white/5 hover:text-white'}`}
          >
            {link.label}
          </Link>
        ))}
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
