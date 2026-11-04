'use client';

import { useState } from 'react';

import { Icon } from '../../../components/ui/icon';
import { useMovieSearch } from '../hooks/use-movie-search';
import { MovieCard } from './movie-card';
import { MovieDetailsModal } from './movie-details-modal';
import type { Movie } from '../types';
import { MovieGrid } from './movie-grid';
import { MovieGridSkeleton, SearchFeedback } from './search-feedback';
import { SearchHero } from './search-hero';

const suggestions = ['Inception', 'Interestelar', 'Matrix', 'Duna'];
const actionClass =
  'inline-flex items-center justify-center gap-2 rounded-full border border-accent/50 px-5 py-2.5 text-sm font-semibold text-[#c59aff] transition hover:border-accent hover:bg-accent/10 disabled:cursor-wait disabled:opacity-60';

export function MovieSearch() {
  const [inputValue, setInputValue] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const {
    query,
    movies,
    totalResults,
    status,
    loadingMore,
    error,
    search,
    clear,
    loadMore,
    hasMore,
  } = useMovieSearch();
  function submitSearch(value: string) {
    setInputValue(value);
    search(value);
  }
  function clearSearch() {
    setInputValue('');
    clear();
  }
  return (
    <>
      <SearchHero
        value={inputValue}
        onValueChange={setInputValue}
        onSearch={submitSearch}
        onClear={clearSearch}
      />
      <section
        id="search-results"
        aria-labelledby="results-heading"
        aria-busy={status === 'loading' || loadingMore}
        className="px-5 pb-10 sm:px-9 lg:px-12"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="results-heading"
              className="text-xl font-bold tracking-tight sm:text-2xl"
            >
              {status === 'idle'
                ? 'Sua próxima descoberta'
                : 'Resultados da busca'}
            </h2>
            {query && (
              <p className="mt-2 text-sm text-muted">
                {status === 'loading' ? 'Buscando por' : 'Busca por'}{' '}
                <span className="font-medium text-[#e0d5ef]">“{query}”</span>
              </p>
            )}
          </div>
          {status === 'success' && totalResults > 0 && (
            <p role="status" className="text-xs text-muted">
              {new Intl.NumberFormat('pt-BR').format(totalResults)}{' '}
              {totalResults === 1 ? 'filme encontrado' : 'filmes encontrados'}
            </p>
          )}
        </div>
        {status === 'idle' && (
          <SearchFeedback
            variant="initial"
            title="Busque por um título"
            action={
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => submitSearch(suggestion)}
                    className="rounded-full border border-[#49335e] bg-[#22182e] px-4 py-2 text-xs text-[#d3b9f1] transition-colors hover:border-accent hover:bg-[#382147]"
                  >
                    {suggestion}
                    <span className="sr-only"> — buscar filmes</span>
                  </button>
                ))}
              </div>
            }
          >
            Não sabe por onde começar? Experimente uma destas buscas.
          </SearchFeedback>
        )}
        {status === 'loading' && <MovieGridSkeleton />}
        {status === 'error' && (
          <SearchFeedback
            variant="error"
            title="Não conseguimos buscar agora."
            action={
              <button
                type="button"
                className={actionClass}
                onClick={() => search(query)}
              >
                Tentar novamente
                <Icon name="arrow" className="size-4" />
              </button>
            }
          >
            {error}
          </SearchFeedback>
        )}
        {status === 'success' && movies.length === 0 && (
          <SearchFeedback title="Nenhum filme por aqui.">
            Não encontramos filmes para “{query}”. Tente outro título ou confira
            a grafia.
          </SearchFeedback>
        )}
        {movies.length > 0 && (
          <MovieGrid>
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={setSelectedMovie}
              />
            ))}
          </MovieGrid>
        )}
        {status === 'success' && movies.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            {error && (
              <p role="alert" className="text-center text-sm text-[#e4b8ce]">
                {error}
              </p>
            )}
            {hasMore ? (
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className={actionClass}
              >
                {loadingMore ? (
                  <>
                    <Icon name="spinner" className="size-4 animate-spin" />
                    Carregando mais filmes…
                  </>
                ) : (
                  <>
                    {error ? 'Tentar carregar novamente' : 'Mais resultados'}
                    <Icon name="chevron" className="size-4" />
                  </>
                )}
              </button>
            ) : (
              <p className="text-xs text-muted">
                Você chegou ao fim dos resultados.
              </p>
            )}
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
