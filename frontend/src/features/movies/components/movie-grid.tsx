import type { ReactNode } from 'react';

export function MovieGrid({
  children,
  label = 'Filmes encontrados',
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <ul
      aria-label={label}
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5"
    >
      {children}
    </ul>
  );
}
