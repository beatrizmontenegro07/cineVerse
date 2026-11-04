'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { listRatings } from '../api';
import { RATINGS_CHANGED } from '../events';
import type { Rating, RatingFilters } from '../types';

interface ListState {
  ratings: Rating[];
  page: number;
  totalPages: number;
  totalResults: number;
  status: 'loading' | 'ready' | 'error';
  loadingMore: boolean;
  refreshing: boolean;
  error: string | null;
}

const initialState: ListState = {
  ratings: [],
  page: 0,
  totalPages: 0,
  totalResults: 0,
  status: 'loading',
  loadingMore: false,
  refreshing: false,
  error: null,
};

export function useRatedMovies(filters: RatingFilters) {
  const [state, setState] = useState<ListState>(initialState);
  const controller = useRef<AbortController | null>(null);
  const pending = useRef(false);

  const requestPage = useCallback(
    async (page: number) => {
      controller.current?.abort();
      const current = new AbortController();
      controller.current = current;
      pending.current = true;
      setState((previous) => ({
        ...previous,
        status: previous.ratings.length ? 'ready' : 'loading',
        refreshing: page === 1,
        loadingMore: page > 1,
        error: null,
      }));
      try {
        const data = await listRatings(page, current.signal, filters);
        if (current.signal.aborted) return;
        setState((previous) => ({
          ratings: Array.from(
            new Map(
              [...(page === 1 ? [] : previous.ratings), ...data.results].map(
                (rating) => [rating.movie_id, rating],
              ),
            ).values(),
          ),
          page: data.page,
          totalPages: data.total_pages,
          totalResults: data.total_results,
          status: 'ready',
          loadingMore: false,
          refreshing: false,
          error: null,
        }));
      } catch (error) {
        if (!current.signal.aborted)
          setState((previous) => ({
            ...previous,
            status: previous.ratings.length ? 'ready' : 'error',
            loadingMore: false,
            refreshing: false,
            error:
              error instanceof Error
                ? error.message
                : 'Não foi possível carregar suas avaliações.',
          }));
      } finally {
        if (controller.current === current) pending.current = false;
      }
    },
    [filters.genre, filters.year],
  );

  const refresh = useCallback(() => {
    void requestPage(1);
  }, [requestPage]);
  useEffect(() => {
    setState(initialState);
    refresh();
    window.addEventListener(RATINGS_CHANGED, refresh);
    window.addEventListener('focus', refresh);
    return () => {
      controller.current?.abort();
      window.removeEventListener(RATINGS_CHANGED, refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [refresh]);

  return {
    ...state,
    refresh,
    hasMore: state.page < state.totalPages,
    loadMore: () => {
      if (!pending.current && state.page < state.totalPages)
        void requestPage(state.page + 1);
    },
  };
}
