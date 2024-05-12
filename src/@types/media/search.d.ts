export type SearchMovieProps = {
  page: number;
  results: Array<{
    poster_path: string | null;
    adult: boolean;
    genre_ids: Array<number>;
    id: number;
    title: string;
    backdrop_path: string | null;
    popularity: number;
    vote_count: number;
    media_type: string;
  }>;
  total_results: number;
  total_pages: number;
};
export type SeriesProps = {
  page: number;
  results: Array<{
    poster_path: string | null;
    popularity: number;
    id: number;
    backdrop_path: string | null;
    vote_average: number;
    overview: string;
    first_air_date: string;
    origin_country: Array<string>;
    genre_ids: Array<number>;
    original_language: string;
    vote_count: number;
    name: string;
    original_name: string;
  }>;
  total_results: number;
  total_pages: number;
};
export type MultiSearchProps = {
  results: Array<{
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: Array<number>;
    id: number;
    media_type: 'movie' | 'tv' | 'person';
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    name: string;
    original_name: string;
    profile_path: string | null;
  }>;
};
export type PopularProps = {
  results: {
    results: Array<{
      backdropPath: string;
      genreIds: number[];
      id: number;
      posterPath: string;
      title: string;
      mediaType: 'movie' | 'tv';
    }>;
  };
};
