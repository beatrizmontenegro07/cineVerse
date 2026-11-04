import { ApiError, requestEmpty, requestJson } from '../../lib/api';
import type {
  Rating,
  RatingFilterOptions,
  RatingFilters,
  RatingsPage,
  RatingScore,
} from './types';

let csrfRequest: Promise<string> | null = null;

function isCsrfResponse(value: unknown): value is { csrf_token: string } {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as { csrf_token?: unknown }).csrf_token === 'string'
  );
}

function csrfToken() {
  // Share concurrent bootstrap requests so the browser gets one session cookie.
  if (!csrfRequest) {
    csrfRequest = requestJson('/api/csrf/', isCsrfResponse)
      .then((data) => data.csrf_token)
      .finally(() => {
        csrfRequest = null;
      });
  }
  return csrfRequest;
}

function isRating(value: unknown): value is Rating {
  if (!value || typeof value !== 'object') return false;
  const rating = value as Partial<Rating>;
  return (
    Number.isInteger(rating.movie_id) &&
    typeof rating.title === 'string' &&
    (rating.poster_url === null ||
      (typeof rating.poster_url === 'string' &&
        rating.poster_url.startsWith('https://image.tmdb.org/'))) &&
    (rating.release_date === null || typeof rating.release_date === 'string') &&
    Number.isInteger(rating.score) &&
    Number(rating.score) >= 1 &&
    Number(rating.score) <= 5 &&
    typeof rating.created_at === 'string' &&
    typeof rating.updated_at === 'string'
  );
}

function isRatingsPage(value: unknown): value is RatingsPage {
  if (!value || typeof value !== 'object') return false;
  const page = value as Partial<RatingsPage>;
  return (
    typeof page.page === 'number' &&
    typeof page.total_pages === 'number' &&
    typeof page.total_results === 'number' &&
    Array.isArray(page.results) &&
    page.results.every(isRating)
  );
}

async function writeOptions(
  method: string,
  signal: AbortSignal,
  body?: object,
) {
  const token = await csrfToken();
  signal.throwIfAborted();
  return {
    method,
    signal,
    headers: { 'X-CSRFToken': token, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
}

export async function getRating(
  movieId: number,
  signal: AbortSignal,
): Promise<Rating | null> {
  try {
    return await requestJson(`/api/ratings/${movieId}/`, isRating, { signal });
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 404 &&
      error.code === 'rating_not_found'
    )
      return null;
    throw error;
  }
}

export function listRatings(
  page: number,
  signal: AbortSignal,
  filters: RatingFilters = { genre: '', year: '' },
): Promise<RatingsPage> {
  const parameters = new URLSearchParams({ page: String(page) });
  if (filters.genre) parameters.set('genre', filters.genre);
  if (filters.year) parameters.set('year', filters.year);
  return requestJson(`/api/ratings/?${parameters}`, isRatingsPage, { signal });
}

export function getRatingFilterOptions(
  signal: AbortSignal,
): Promise<RatingFilterOptions> {
  return requestJson(
    '/api/ratings/filter-options/',
    (value): value is RatingFilterOptions => {
      if (!value || typeof value !== 'object') return false;
      const options = value as Partial<RatingFilterOptions>;
      return (
        Array.isArray(options.genres) &&
        options.genres.every(
          (genre) =>
            genre &&
            Number.isInteger(genre.id) &&
            typeof genre.name === 'string',
        ) &&
        Array.isArray(options.years) &&
        options.years.every(
          (year) => Number.isInteger(year) && year >= 1000 && year <= 9999,
        )
      );
    },
    { signal },
  );
}

export async function saveRating(
  movieId: number,
  score: RatingScore,
  existing: boolean,
  signal: AbortSignal,
): Promise<Rating> {
  const path = existing ? `/api/ratings/${movieId}/` : '/api/ratings/';
  const options = await writeOptions(
    existing ? 'PATCH' : 'POST',
    signal,
    existing ? { score } : { movie_id: movieId, score },
  );
  try {
    return await requestJson(path, isRating, options);
  } catch (error) {
    if (
      existing &&
      error instanceof ApiError &&
      error.code === 'rating_not_found'
    ) {
      return requestJson('/api/ratings/', isRating, {
        ...options,
        method: 'POST',
        body: JSON.stringify({ movie_id: movieId, score }),
      });
    }
    if (
      !existing &&
      error instanceof ApiError &&
      error.code === 'rating_exists'
    ) {
      return requestJson(`/api/ratings/${movieId}/`, isRating, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify({ score }),
      });
    }
    throw error;
  }
}

export async function deleteRating(
  movieId: number,
  signal: AbortSignal,
): Promise<void> {
  try {
    await requestEmpty(
      `/api/ratings/${movieId}/`,
      await writeOptions('DELETE', signal),
    );
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 404 &&
      error.code === 'rating_not_found'
    )
      return;
    throw error;
  }
}
