'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { searchMovies } from '../api';
import type { Movie, SearchStatus } from '../types';

interface SearchState {
  query: string;
  movies: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
  status: SearchStatus;
  loadingMore: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  movies: [],
  page: 0,
  totalPages: 0,
  totalResults: 0,
  status: 'idle',
  loadingMore: false,
  error: null,
};

export function useMovieSearch() {
  const [state, setState] = useState<SearchState>(initialState);
  const controller = useRef<AbortController | null>(null);
  const pending = useRef(false);

  useEffect(() => () => controller.current?.abort(), []);

  const clear = useCallback(() => {
    controller.current?.abort();
    pending.current = false;
    setState(initialState);
  }, []);

  const requestPage = useCallback(async (query: string, page: number) => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    pending.current = true;
    setState((previous) =>
      page === 1
        ? { ...initialState, query, status: 'loading' }
        : { ...previous, loadingMore: true, error: null },
    );
    try {
      const data = await searchMovies(query, page, current.signal);
      if (current.signal.aborted) return;
      setState((previous) => ({
        query,
        movies: Array.from(
          new Map(
            [...(page === 1 ? [] : previous.movies), ...data.results].map(
              (movie) => [movie.id, movie],
            ),
          ).values(),
        ),
        page: data.page,
        totalPages: Math.min(data.total_pages, 500),
        totalResults: data.total_results,
        status: 'success',
        loadingMore: false,
        error: null,
      }));
    } catch (error) {
      if (current.signal.aborted) return;
      setState((previous) => ({
        ...previous,
        status: page === 1 ? 'error' : 'success',
        loadingMore: false,
        error:
          error instanceof Error
            ? error.message
            : 'Não foi possível buscar os filmes.',
      }));
    } finally {
      if (controller.current === current) pending.current = false;
    }
  }, []);

  const search = useCallback(
    (value: string) => {
      const query = value.trim();
      if (!query) return clear();
      void requestPage(query, 1);
    },
    [clear, requestPage],
  );

  const loadMore = useCallback(() => {
    if (pending.current || state.page >= state.totalPages) return;
    void requestPage(state.query, state.page + 1);
  }, [requestPage, state.page, state.query, state.totalPages]);

  return {
    ...state,
    search,
    clear,
    loadMore,
    hasMore: state.page < state.totalPages,
  };
}
