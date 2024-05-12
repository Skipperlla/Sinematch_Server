export type DetailProps = {
  _id: string;
  air_date: string;
  episodes: Array<{
    air_date: string;
    show_id: number;
    episode_number: number;
    runtime: number;
    crew: Array<{
      department: string;
      job: string;
      credit_id: string;
      adult: boolean | null;
      gender: number;
      id: number;
      known_for_department: string;
      name: string;
      original_name: string;
      popularity: number;
      profile_path: string | null;
    }>;
    guest_stars: Array<{
      credit_id: string;
      order: number;
      character: string;
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
    name: string;
    overview: string;
    production_code: string;
    season_number: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
  }>;
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
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
export type ImagesProps = {
  id: number;

  posters: Array<{
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
