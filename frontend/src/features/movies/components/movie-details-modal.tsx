'use client';

import { useId } from 'react';

import { Icon } from '../../../components/ui/icon';
import { Modal } from '../../../components/ui/modal';
import { useMovieDetails } from '../hooks/use-movie-details';
import type { Movie } from '../types';
import { MovieDetailsContent } from './movie-details-content';
import { SearchFeedback } from './search-feedback';

export function MovieDetailsModal({
  movie,
  onClose,
}: {
  movie: Movie;
  onClose: () => void;
}) {
  const titleId = useId();
  const { state, retry } = useMovieDetails(movie.id);

  return (
    <Modal titleId={titleId} onClose={onClose}>
      {state.status === 'success' ? (
        <MovieDetailsContent movie={state.movie} titleId={titleId} />
      ) : (
        <>
          <h2 id={titleId} className="mb-6 pr-10 text-2xl font-bold">
            {movie.title}
          </h2>
          {state.status === 'loading' ? (
            <div
              role="status"
              aria-label="Carregando detalhes do filme"
              className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]"
            >
              <div
                aria-hidden="true"
                className="mx-auto aspect-[2/3] w-40 animate-pulse rounded-xl bg-[#2a2035] md:w-full"
              />
              <div aria-hidden="true" className="space-y-5 py-3">
                <div className="h-5 w-2/3 animate-pulse rounded bg-[#2a2035]" />
                <div className="h-28 animate-pulse rounded bg-[#221a2c]" />
                <div className="h-20 animate-pulse rounded bg-[#221a2c]" />
              </div>
              <span className="sr-only">Carregando detalhes…</span>
            </div>
          ) : (
            <SearchFeedback
              variant="error"
              title="Não conseguimos carregar os detalhes."
              action={
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center gap-2 rounded-full border border-accent/50 px-5 py-2.5 text-sm font-semibold text-[#c59aff] transition hover:border-accent hover:bg-accent/10"
                >
                  Tentar novamente
                  <Icon name="arrow" className="size-4" />
                </button>
              }
            >
              {state.error}
            </SearchFeedback>
          )}
        </>
      )}
    </Modal>
  );
}
