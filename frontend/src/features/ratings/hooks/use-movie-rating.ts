'use client';

import { useCallback, useEffect, useState } from 'react';

import { getRating } from '../api';
import type { Rating, RatingScore } from '../types';

interface RatingState {
  rating: Rating | null;
  score: RatingScore | 0;
  status: 'loading' | 'ready' | 'error';
  error: string | null;
}

export function useMovieRating(movieId: number) {
  const [state, setState] = useState<RatingState>({
    rating: null,
    score: 0,
    status: 'loading',
    error: null,
  });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ ...previous, status: 'loading', error: null }));
    getRating(movieId, controller.signal)
      .then((rating) => {
        if (!controller.signal.aborted)
          setState({
            rating,
            score: rating?.score ?? 0,
            status: 'ready',
            error: null,
          });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState((previous) => ({
            ...previous,
            status: 'error',
            error:
              error instanceof Error
                ? error.message
                : 'Não foi possível carregar sua avaliação.',
          }));
      });
    return () => controller.abort();
  }, [movieId, attempt]);

  return {
    ...state,
    retry: () => setAttempt((value) => value + 1),
    selectScore: (score: RatingScore) =>
      setState((previous) => ({ ...previous, score })),
    setRating: useCallback(
      (rating: Rating | null) =>
        setState({
          rating,
          score: rating?.score ?? 0,
          status: 'ready',
          error: null,
        }),
      [],
    ),
  };
}
