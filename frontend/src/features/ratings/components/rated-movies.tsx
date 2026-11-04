'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Icon } from '../../../components/ui/icon';
import { MovieDetailsModal } from '../../movies/components/movie-details-modal';
import { SearchFeedback } from '../../movies/components/search-feedback';
import type { Movie } from '../../movies/types';
import { useRatedMovies } from '../hooks/use-rated-movies';
import type { Rating, RatingFilters as Filters } from '../types';
import { RatedMovieRow } from './rated-movie-row';
import { RatingFilters } from './rating-filters';

const buttonClass =
  'inline-flex items-center justify-center gap-2 rounded-full border border-accent/50 px-5 py-2.5 text-sm font-semibold text-[#c59aff] transition hover:border-accent hover:bg-accent/10 disabled:cursor-wait disabled:opacity-50';

export function RatedMovies() {
  const [filters, setFilters] = useState<Filters>({ genre: '', year: '' });
  const [draftFilters, setDraftFilters] = useState<Filters>({
    genre: '',
    year: '',
  });
  const filtered = Boolean(filters.genre || filters.year);
  function clearFilters() {
    setDraftFilters({ genre: '', year: '' });
    setFilters({ genre: '', year: '' });
  }
  const {
    ratings,
    totalResults,
    status,
    error,
    refreshing,
    loadingMore,
    hasMore,
    refresh,
    loadMore,
  } = useRatedMovies(filters);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [message, setMessage] = useState('');
  function openDetails(rating: Rating) {
    setSelectedMovie({
      id: rating.movie_id,
      title: rating.title,
      poster_url: rating.poster_url,
    });
  }
  return (
    <>
      <section
        aria-labelledby="rated-heading"
        className="mx-auto w-full max-w-6xl px-5 py-9 sm:px-9 sm:py-12 lg:px-12"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1
              id="rated-heading"
              className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl"
            >
              <Icon
                name="star"
                fill="currentColor"
                className="size-7 shrink-0 text-[#ffcc4d]"
              />
              Meus Filmes Avaliados
            </h1>
            <p className="mt-3 text-sm text-muted">
              Confira todos os filmes que você já avaliou.
            </p>
          </div>
          {status === 'ready' && (
            <p className="text-xs text-muted">
              {totalResults}{' '}
              {totalResults === 1 ? 'filme avaliado' : 'filmes avaliados'}
            </p>
          )}
        </div>
        <RatingFilters
          value={draftFilters}
          onChange={setDraftFilters}
          onApply={() => {
            setFilters({ ...draftFilters });
            setMessage('');
          }}
          onClear={clearFilters}
        />
        {message && (
          <p role="status" className="mb-5 text-sm text-[#c4a4ed]">
            {message}
          </p>
        )}
        {status === 'loading' && (
          <div
            role="status"
            aria-label="Carregando filmes avaliados"
            className="space-y-4"
          >
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                aria-hidden="true"
                className="h-28 animate-pulse rounded-xl bg-surface"
              />
            ))}
            <span className="sr-only">Carregando avaliações…</span>
          </div>
        )}
        {status === 'error' && (
          <SearchFeedback
            variant="error"
            title="Não conseguimos carregar seus filmes."
            action={
              <button type="button" onClick={refresh} className={buttonClass}>
                Tentar novamente
              </button>
            }
          >
            {error}
          </SearchFeedback>
        )}
        {status === 'ready' && !ratings.length && (
          <SearchFeedback
            title={
              filtered
                ? 'Nenhum filme avaliado com esses filtros.'
                : 'Sua lista começa com uma boa história.'
            }
            action={
              filtered ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className={buttonClass}
                >
                  Limpar filtros
                </button>
              ) : (
                <Link href="/" className={buttonClass}>
                  Buscar filmes
                  <Icon name="arrow" className="size-4" />
                </Link>
              )
            }
          >
            {filtered
              ? 'Escolha outro gênero ou ano, ou remova os filtros para ver toda a sua lista.'
              : 'Você ainda não avaliou nenhum filme. Escolha um título e salve sua primeira nota.'}
          </SearchFeedback>
        )}
        {ratings.length > 0 && (
          <ul
            aria-label="Filmes avaliados"
            aria-busy={refreshing}
            className="space-y-4"
          >
            {ratings.map((rating) => (
              <RatedMovieRow
                key={rating.movie_id}
                rating={rating}
                onDetails={openDetails}
                onDeleted={(title) =>
                  setMessage(`Avaliação de ${title} removida.`)
                }
              />
            ))}
          </ul>
        )}
        {status === 'ready' && error && (
          <div role="alert" className="mt-5 text-center text-sm text-[#e4b8ce]">
            <p>{error}</p>
            <button
              type="button"
              onClick={refresh}
              className="mt-3 rounded text-accent underline underline-offset-4"
            >
              Tentar atualizar novamente
            </button>
          </div>
        )}
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore || refreshing}
              className={buttonClass}
            >
              {loadingMore ? (
                <>
                  <Icon name="spinner" className="size-4 animate-spin" />
                  Carregando…
                </>
              ) : (
                <>
                  Mais filmes
                  <Icon name="chevron" className="size-4" />
                </>
              )}
            </button>
          </div>
        )}
      </section>
      {selectedMovie && (
        <MovieDetailsModal
          key={selectedMovie.id}
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
