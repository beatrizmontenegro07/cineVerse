import { requestJson } from '../../lib/api';
import type {
  CastMember,
  Movie,
  MovieDetails,
  MovieGenre,
  MovieSearchResponse,
} from './types';

const fallbackError =
  'O serviço retornou uma resposta inválida. Tente novamente.';

function isImageUrl(value: unknown): value is string | null {
  return (
    value === null ||
    (typeof value === 'string' && value.startsWith('https://image.tmdb.org/'))
  );
}

function isMovie(value: unknown): value is Movie {
  if (!value || typeof value !== 'object') return false;
  const movie = value as Partial<Movie>;
  return (
    typeof movie.id === 'number' &&
    typeof movie.title === 'string' &&
    isImageUrl(movie.poster_url)
  );
}

function isSearchResponse(value: unknown): value is MovieSearchResponse {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<MovieSearchResponse>;
  return (
    typeof data.page === 'number' &&
    typeof data.total_pages === 'number' &&
    typeof data.total_results === 'number' &&
    Array.isArray(data.results) &&
    data.results.every(isMovie)
  );
}

function isGenre(value: unknown): value is MovieGenre {
  if (!value || typeof value !== 'object') return false;
  const genre = value as Partial<MovieGenre>;
  return typeof genre.id === 'number' && typeof genre.name === 'string';
}

function isCastMember(value: unknown): value is CastMember {
  if (!isGenre(value)) return false;
  const actor = value as Partial<CastMember>;
  return typeof actor.character === 'string' && isImageUrl(actor.profile_url);
}

function isMovieDetails(value: unknown): value is MovieDetails {
  if (!isMovie(value)) return false;
  const movie = value as Partial<MovieDetails>;
  return (
    typeof movie.synopsis === 'string' &&
    (movie.release_date === null ||
      (typeof movie.release_date === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(movie.release_date) &&
        !Number.isNaN(Date.parse(movie.release_date)))) &&
    (movie.runtime_minutes === null ||
      (typeof movie.runtime_minutes === 'number' &&
        Number.isInteger(movie.runtime_minutes) &&
        movie.runtime_minutes >= 0)) &&
    (movie.vote_average === null ||
      (typeof movie.vote_average === 'number' &&
        movie.vote_average >= 0 &&
        movie.vote_average <= 10)) &&
    Array.isArray(movie.genres) &&
    movie.genres.every(isGenre) &&
    Array.isArray(movie.cast) &&
    movie.cast.every(isCastMember)
  );
}

export function searchMovies(
  query: string,
  page: number,
  signal: AbortSignal,
): Promise<MovieSearchResponse> {
  const parameters = new URLSearchParams({ query, page: String(page) });
  return requestJson(`/api/movies/search/?${parameters}`, isSearchResponse, {
    signal,
  });
}

export async function getMovieDetails(
  movieId: number,
  signal: AbortSignal,
): Promise<MovieDetails> {
  const movie = await requestJson(`/api/movies/${movieId}/`, isMovieDetails, {
    signal,
  });
  if (movie.id !== movieId) throw new Error(fallbackError);
  return movie;
}
