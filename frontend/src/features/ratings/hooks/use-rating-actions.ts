'use client';

import { useEffect, useRef, useState } from 'react';

import { deleteRating, saveRating } from '../api';
import { notifyRatingsChanged } from '../events';
import type { RatingScore } from '../types';

export function useRatingActions(movieId: number) {
  const [action, setAction] = useState<'saving' | 'deleting' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const pending = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  async function run<T>(
    operation: (signal: AbortSignal) => Promise<T>,
    nextAction: 'saving' | 'deleting',
  ): Promise<T | undefined> {
    if (pending.current) return;
    const current = new AbortController();
    pending.current = true;
    setAction(nextAction);
    setError(null);
    try {
      const result = await operation(current.signal);
      // Finish explicit writes even if the modal closes; refresh the list only
      // after the server confirms the change.
      notifyRatingsChanged();
      if (mounted.current) return result;
    } catch (error) {
      if (mounted.current)
        setError(
          error instanceof Error
            ? error.message
            : 'Não foi possível atualizar sua avaliação.',
        );
    } finally {
      pending.current = false;
      if (mounted.current) setAction(null);
    }
  }

  return {
    action,
    error,
    save: (score: RatingScore, existing: boolean) =>
      run((signal) => saveRating(movieId, score, existing, signal), 'saving'),
    remove: () =>
      run(async (signal) => {
        await deleteRating(movieId, signal);
        return true;
      }, 'deleting'),
  };
}
