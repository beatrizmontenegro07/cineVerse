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

export interface MovieGenre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_url: string | null;
}

export interface MovieDetails extends Movie {
  synopsis: string;
  release_date: string | null;
  runtime_minutes: number | null;
  vote_average: number | null;
  genres: MovieGenre[];
  cast: CastMember[];
}

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
