export interface Movie {
  id: number;
  title: string;
  poster_url: string | null;
}

export interface MovieSearchResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Movie[];
}

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
