export type SeriesDetailProps = {
  adult: boolean;
  backdrop_path: string | null;
  created_by: Array<{
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }>;
  episode_run_time: number[];
  first_air_date: string;
  genres: Array<{
    id: number;
    name: string;
  }>;
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    season_number: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
    runTime: number;
    show_id: number;
  };
  name: string;
  next_episode_to_air: null;
  networks: Array<{
    name: string;
    id: number;
    logo_path: string | null;
    origin_country: string;
  }>;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  seasons: Array<{
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
  }>;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
};
export type CreditsProps = {
  cast: Array<{
    adult: boolean;
    gender: number | null;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
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
  id: number;
};
export type ExternalIDsProps = {
  imdb_id: string | null;
  facebook_id: string | null;
  freebase_mid: string | null;
  freebase_id: string | null;
  tvdb_id: number | null;
  tvrage_id: number | null;

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
export type RecommendationsProps = {
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
  total_pages: number;
  total_results: number;
};
export type SimilarProps = {
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
type ProviderProps = {
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
export type PopularProps = {
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
  total_pages: number;
  total_results: number;
};
export type TopRatedProps = {
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
  total_pages: number;
  total_results: number;
};
