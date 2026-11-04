'use client';

import { useCallback, useEffect, useState } from 'react';

import { getRatingFilterOptions } from '../api';
import { RATINGS_CHANGED } from '../events';
import type { RatingFilterOptions } from '../types';

export function useRatingFilterOptions() {
  const [options, setOptions] = useState<RatingFilterOptions>({
    genres: [],
    years: [],
  });
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    getRatingFilterOptions(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setOptions(data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error');
      });
    window.addEventListener(RATINGS_CHANGED, retry);
    window.addEventListener('focus', retry);
    return () => {
      controller.abort();
      window.removeEventListener(RATINGS_CHANGED, retry);
      window.removeEventListener('focus', retry);
    };
  }, [attempt, retry]);
  return { options, status, retry };
}
