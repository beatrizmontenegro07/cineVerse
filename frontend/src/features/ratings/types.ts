export type RatingScore = 1 | 2 | 3 | 4 | 5;

export interface Rating {
  movie_id: number;
  title: string;
  poster_url: string | null;
  release_date: string | null;
  score: RatingScore;
  created_at: string;
  updated_at: string;
}

export interface RatingsPage {
  page: number;
  total_pages: number;
  total_results: number;
  results: Rating[];
}

export interface RatingFilters {
  genre: string;
  year: string;
}

export interface RatingFilterOptions {
  genres: { id: number; name: string }[];
  years: number[];
}
