import type {
  CastMember,
  Movie,
  MovieDetails,
  MovieGenre,
  MovieSearchResponse,
} from './types';

const errorMessages: Record<string, string> = {
  tmdb_not_configured:
    'O serviço de filmes está temporariamente indisponível. Tente novamente mais tarde.',
  tmdb_rate_limited:
    'Muitas consultas no momento. Aguarde um pouco e tente novamente.',
  tmdb_timeout: 'A consulta demorou mais que o esperado. Tente novamente.',
  invalid_parameters:
    'Não foi possível consultar este filme. Tente novamente.',
  movie_not_found:
    'Este filme não foi encontrado.',
};
const fallbackError = 'Não foi possível carregar os filmes. Tente novamente.';

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

async function requestMovies<T>(
  url: string,
  signal: AbortSignal,
  validate: (value: unknown) => value is T,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(15_000)]),
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new Error(
      'Não foi possível conectar ao serviço de filmes. Verifique sua conexão e tente novamente.',
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error(fallbackError);
  }
  if (!response.ok) {
    const code = (data as { error?: { code?: string } } | null)?.error?.code;
    throw new Error((code && errorMessages[code]) || fallbackError);
  }
  if (!validate(data)) throw new Error(fallbackError);
  return data;
}

export function searchMovies(
  query: string,
  page: number,
  signal: AbortSignal,
): Promise<MovieSearchResponse> {
  const parameters = new URLSearchParams({ query, page: String(page) });
  return requestMovies(
    `/api/movies/search/?${parameters}`,
    signal,
    isSearchResponse,
  );
}

export async function getMovieDetails(
  movieId: number,
  signal: AbortSignal,
): Promise<MovieDetails> {
  const movie = await requestMovies(
    `/api/movies/${movieId}/`,
    signal,
    isMovieDetails,
  );
  if (movie.id !== movieId) throw new Error(fallbackError);
  return movie;
}
