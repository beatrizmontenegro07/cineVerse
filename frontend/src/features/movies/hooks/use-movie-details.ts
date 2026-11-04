'use client';

import { useCallback, useEffect, useState } from 'react';

import { getMovieDetails } from '../api';
import type { MovieDetails } from '../types';

type DetailsState =
  | { status: 'loading' }
  | { status: 'success'; movie: MovieDetails }
  | { status: 'error'; error: string };

export function useMovieDetails(movieId: number) {
  const [state, setState] = useState<DetailsState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    getMovieDetails(movieId, controller.signal)
      .then((movie) => {
        if (!controller.signal.aborted) setState({ status: 'success', movie });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setState({
            status: 'error',
            error:
              error instanceof Error
                ? error.message
                : 'Não foi possível carregar os detalhes.',
          });
        }
      });
    return () => controller.abort();
  }, [movieId, attempt]);

  return { state, retry };
}
