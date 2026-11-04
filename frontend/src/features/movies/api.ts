import type { Movie, MovieSearchResponse } from './types';

const errorMessages: Record<string, string> = {
  tmdb_not_configured:
    'A busca está temporariamente indisponível. Tente novamente mais tarde.',
  tmdb_rate_limited:
    'Muitas buscas no momento. Aguarde um pouco e tente novamente.',
  tmdb_timeout: 'A busca demorou mais que o esperado. Tente novamente.',
  invalid_parameters: 'Confira o nome do filme e tente novamente.',
};

function isMovie(value: unknown): value is Movie {
  if (!value || typeof value !== 'object') return false;
  const movie = value as Partial<Movie>;
  return (
    typeof movie.id === 'number' &&
    typeof movie.title === 'string' &&
    (movie.poster_url === null ||
      (typeof movie.poster_url === 'string' &&
        movie.poster_url.startsWith('https://image.tmdb.org/')))
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

export async function searchMovies(
  query: string,
  page: number,
  signal: AbortSignal,
): Promise<MovieSearchResponse> {
  const parameters = new URLSearchParams({ query, page: String(page) });
  let response: Response;
  try {
    response = await fetch(`/api/movies/search/?${parameters}`, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(15_000)]),
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new Error(
      'Não foi possível conectar à busca. Verifique sua conexão e tente novamente.',
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error('Não foi possível carregar os filmes. Tente novamente.');
  }
  if (!response.ok) {
    const code = (data as { error?: { code?: string } } | null)?.error?.code;
    throw new Error(
      (code && errorMessages[code]) ||
        'Não foi possível carregar os filmes. Tente novamente.',
    );
  }
  if (!isSearchResponse(data))
    throw new Error('Não foi possível carregar os filmes. Tente novamente.');
  return data;
}
