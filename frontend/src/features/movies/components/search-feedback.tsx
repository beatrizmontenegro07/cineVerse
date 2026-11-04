import type { ReactNode } from 'react';

import { Icon } from '../../../components/ui/icon';
import { MovieGrid } from './movie-grid';

interface SearchFeedbackProps {
  variant?: 'empty' | 'error' | 'initial';
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function SearchFeedback({
  variant = 'empty',
  title,
  children,
  action,
}: SearchFeedbackProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className="flex min-h-65 flex-col items-center justify-center rounded-2xl border border-dashed border-[#3a2f49] bg-[#14101c]/50 px-5 py-10 text-center"
    >
      <span className="mb-5 flex size-15 items-center justify-center rounded-2xl border border-accent/15 bg-accent/8 text-accent">
        <Icon
          name={
            variant === 'error'
              ? 'alert'
              : variant === 'initial'
                ? 'film'
                : 'search'
          }
          className="size-7"
        />
      </span>
      <h3 className="text-lg font-semibold text-[#f0ebf7]">{title}</h3>
      <div className="mt-2 max-w-md text-sm leading-6 text-muted">
        {children}
      </div>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function MovieGridSkeleton() {
  return (
    <div role="status" aria-label="Buscando filmes">
      <MovieGrid label="Carregando filmes">
        {Array.from({ length: 10 }, (_, index) => (
          <li
            key={index}
            aria-hidden="true"
            className="aspect-[2/3] animate-pulse rounded-xl border border-white/5 bg-[linear-gradient(145deg,#251c31,#131018)]"
          />
        ))}
      </MovieGrid>
      <span className="sr-only">Buscando filmes…</span>
    </div>
  );
}
