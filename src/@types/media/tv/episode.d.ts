export type DetailProps = {
  air_date: string;
  crew: Array<{
    id: number;
    credit_id: string;
    name: string;
    department: string;
    job: string;
    profile_path: string | null;
    popularity: number;
    gender: number;
    adult: boolean;
    known_for_department: string;
    original_name: string;
    poster_path: string | null;
  }>;
  episode_number: number;
  guest_stars: Array<{
    id: number;
    name: string;
    credit_id: string;
    character: string;
    order: number;
    profile_path: string | null;
    popularity: number;
    adult: boolean;
    gender: number;
    known_for_department: string;
    original_name: string;
  }>;
  name: string;
  overview: string;
  id: number;
  production_code: string;
  season_number: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  runtime: number;
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
  guest_stars: Array<{
    character_name: string;
    credit_id: string;
    order: number;
    adult: boolean;
    gender: number | null;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
  }>;
  id: number;
};
export type ImagesProps = {
  id: number;
  stills: Array<{
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: string | null;
    vote_average: number;
    vote_count: number;
    width: number;
  }>;
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
