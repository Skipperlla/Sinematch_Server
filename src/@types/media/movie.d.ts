type MovieStatusProps =
  | 'Rumored'
  | 'Planned'
  | 'In Production'
  | 'Post Production'
  | 'Released'
  | 'Canceled';
export type MovieDetailProps = {
  adult: boolean;
  name: string;
  backdrop_path: string | null;
  belongs_to_collection: null | {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: Array<{
    name: string;
    id: number;
    logo_path: string | null;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: Array<{
    iso_639_1: string;
    name: string;
  }>;
  status: MovieStatusProps;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};
export type CreditsProps = {
  id: number;
  cast: Array<{
    adult: boolean;
    gender: number | null;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
  }>;
  crew: Array<{
    adult: boolean;
    gender: number | null;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    credit_id: string;
    department: string;
    job: string;
  }>;
};
export type ExternalIDsProps = {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  wikidata_id: string | null;
  id: number;
};
export type ImagesProps = {
  id: number;
  backdrops: Array<{
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: string | null;
    vote_average: number;
    vote_count: number;
    width: number;
  }>;
  posters: Array<{
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: string | null;
    vote_average: number;
    vote_count: number;
    width: number;
  }>;
  logos: Array<{
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: string | null;
    vote_average: number;
    vote_count: number;
    width: number;
  }>;
};
export type KeywordsProps = {
  id: number;
  keywords: Array<{
    id: number;
    name: string;
  }>;
};
export type RecommendationsProps = {
  page: number;
  results: Array<{
    poster_path: string | null;
    adult: boolean;
    overview: string;
    release_date: string;
    genre_ids: Array<number>;
    id: number;
    original_title: string;
    original_language: string;
    title: string;
    backdrop_path: string | null;
    popularity: number;
    vote_count: number;
    video: boolean;
    vote_average: number;
  }>;
  total_pages: number;
  total_results: number;
};
export type SimilarProps = {
  page: number;
  results: Array<{
    poster_path: string | null;
    adult: boolean;
    overview: string;
    release_date: string;
    genre_ids: Array<number>;
    id: number;
    original_title: string;
    original_language: string;
    title: string;
    backdrop_path: string | null;
    popularity: number;
    vote_count: number;
    video: boolean;
    vote_average: number;
  }>;
  total_pages: number;
  total_results: number;
};
export type VideosProps = {
  id: number;
  results: Array<{
    id: string;
    iso_639_1: string;
    iso_3166_1: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
  }>;
};
export type ProviderProps = {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
};
export type WatchProvidersProps = {
  id: number;
  results: {
    [key: string]: {
      link: string;
      buy: ProviderProps[];
      flatrate: ProviderProps[];
      rent: ProviderProps[];
    };
  };
};
export type NowPlayingProps = {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: Array<{
    poster_path: string | null;
    adult: boolean;
    overview: string;
    release_date: string;
    genre_ids: number[];
    id: number;
    original_title: string;
    original_language: string;
    title: string;
    backdrop_path: string | null;
    popularity: number;
    vote_count: number;
    video: boolean;
    vote_average: number;
  }>;
  total_pages: number;
  total_results: number;
};
export type PopularProps = {
  page: number;
  results: Array<{
    poster_path: string | null;
    adult: boolean;
    overview: string;
    release_date: string;
    genre_ids: number[];
    id: number;
    original_title: string;
    original_language: string;
    title: string;
    backdrop_path: string | null;
    popularity: number;
    vote_count: number;
    video: boolean;
    vote_average: number;
  }>;
  total_pages: number;
  total_results: number;
};
export type TopRatedProps = {
  page: number;
  results: Array<{
    poster_path: string | null;
    adult: boolean;
    overview: string;
    release_date: string;
    genre_ids: number[];
    id: number;
    original_title: string;
    original_language: string;
    title: string;
    backdrop_path: string | null;
    popularity: number;
    vote_count: number;
    video: boolean;
    vote_average: number;
  }>;
  total_pages: number;
  total_results: number;
};
export type UpcomingProps = {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: Array<{
    poster_path: string | null;
    adult: boolean;
    overview: string;
    release_date: string;
    genre_ids: number[];
    id: number;
    original_title: string;
    original_language: string;
    title: string;
    backdrop_path: string | null;
    popularity: number;
    vote_count: number;
    video: boolean;
    vote_average: number;
  }>;
  total_pages: number;
  total_results: number;
};
