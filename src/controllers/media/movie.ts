import { Request, Response, NextFunction } from 'express';
import { NOT_FOUND, OK } from 'http-status';
import i18next from 'i18next';
import moment from 'moment';
import _ from 'lodash';

import { asyncHandler, customError, currency, utils } from '@scripts/index';
import { tmdbAPI } from '@api/index';
import { tmdbImageURL } from '@constants/index';
import type {
  MovieDetailProps,
  CreditsProps,
  ExternalIDsProps,
  ImagesProps,
  KeywordsProps,
  RecommendationsProps,
  SimilarProps,
  VideosProps,
  WatchProvidersProps,
  NowPlayingProps,
  PopularProps,
  TopRatedProps,
  UpcomingProps,
} from 'type/media/movie';

const Detail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<MovieDetailProps>(
        `/movie/${req.params.movieId}`,
        {
          params: {
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );
      const result = {
        backdropPath:
          data?.backdrop_path && `${tmdbImageURL}${data?.backdrop_path}`,
        budget: currency(data?.budget, req.headers['accept-language']),
        genres: data?.genres,
        id: data?.id,
        originalLanguage: data?.original_language,
        originalTitle: data?.original_title,
        overview: data?.overview,
        popularity: data?.popularity,
        posterPath: data?.poster_path && `${tmdbImageURL}${data?.poster_path}`,
        releaseDate: moment(data?.release_date).format('LL'),
        revenue: currency(data?.revenue, req.headers['accept-language']),
        runtime:
          data?.runtime &&
          utils.runTime(data?.runtime, req.headers['accept-language']),
        status: i18next.t(`movie.status.${data?.status}`),
        tagline: data?.tagline,
        title: data?.title,
        video: data?.video,
        voteAverage: data?.vote_average,
        voteCount: data?.vote_count,
      };
      return res.status(OK).json(utils.makeResponseJson('', result, OK));
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const Credits = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<CreditsProps>(
        `/movie/${req.params.movieId}/credits`,
        {
          params: {
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );
      const cast = data?.cast
        ?.sort((a, b) => b.popularity - a.popularity)
        ?.map((cast) => {
          return {
            gender: i18next.t(`gender.${cast?.gender}`),
            id: cast?.id,
            name: cast?.name,
            originalName: cast?.original_name,
            popularity: cast?.popularity,
            profilePath:
              cast?.profile_path && `${tmdbImageURL}${cast?.profile_path}`,
            character: cast?.character,
          };
        });
      const crew = data?.crew
        ?.sort((a, b) => b.popularity - a.popularity)
        ?.map((cast) => {
          return {
            gender: i18next.t(`gender.${cast?.gender}`),
            id: cast?.id,
            name: cast?.name,
            originalName: cast?.original_name,
            popularity: cast?.popularity,
            profilePath:
              cast?.profile_path && `${tmdbImageURL}${cast?.profile_path}`,
          };
        });
      return res
        .status(OK)
        .json(utils.makeResponseJson('', { ...data, cast, crew }, OK));
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const externalIDs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<ExternalIDsProps>(
        `/movie/${req.params.movieId}/external_ids`,
      );
      return res.status(OK).json(
        utils.makeResponseJson(
          '',
          {
            imdb:
              data?.imdb_id && `https://www.imdb.com/title/${data?.imdb_id}`,
            wikidata:
              data?.wikidata_id &&
              `https://www.wikidata.org/wiki/${data?.wikidata_id}`,
            facebook:
              data?.facebook_id &&
              `https://www.facebook.com/${data?.facebook_id}`,
            instagram:
              data?.instagram_id &&
              `https://www.instagram.com/${data?.instagram_id}`,
            twitter:
              data?.twitter_id && `https://www.twitter.com/${data?.twitter_id}`,
          },
          OK,
        ),
      );
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const Images = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<ImagesProps>(
        `/movie/${req.params.movieId}/images`,
        {
          params: {
            include_image_language: req.headers['accept-language'],
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );
      const backdrops = data?.backdrops?.map((backdrop) => {
        return {
          ...backdrop,
          filePath:
            backdrop?.file_path && `${tmdbImageURL}${backdrop?.file_path}`,
        };
      });
      const posters = data?.posters?.map((backdrop) => {
        return {
          ...backdrop,
          filePath:
            backdrop?.file_path && `${tmdbImageURL}${backdrop?.file_path}`,
        };
      });
      const logos = data?.logos?.map((backdrop) => {
        return {
          ...backdrop,
          filePath:
            backdrop?.file_path && `${tmdbImageURL}${backdrop?.file_path}`,
        };
      });
      return res
        .status(OK)
        .json(
          utils.makeResponseJson(
            '',
            { ...data, backdrops, posters, logos },
            OK,
          ),
        );
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const Keywords = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<KeywordsProps>(
        `/movie/${req.params.movieId}/keywords`,
      );

      return res.status(OK).json(utils.makeResponseJson('', data, OK));
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const Recommendations = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<RecommendationsProps>(
        `/movie/${req.params.movieId}/recommendations`,
        {
          params: {
            ...req.query,
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );
      const results = data?.results
        ?.sort((a, b) => b.popularity - a.popularity)
        ?.map((result) => {
          return {
            backdropPath:
              result?.backdrop_path &&
              `${tmdbImageURL}${result?.backdrop_path}`,
            id: result?.id,
            title: result?.title,
            originalLanguage: result?.original_language,
            originalTitle: result?.original_title,
            overview: result?.overview,
            posterPath:
              result?.poster_path && `${tmdbImageURL}${result?.poster_path}`,
            mediaType: 'movie',
            genreIds: result?.genre_ids,
            popularity: result?.popularity,
            releaseDate: result?.release_date,
            video: result?.video,
            voteAverage: result?.vote_average,
            voteCount: result?.vote_count,
          };
        });
      return res
        .status(OK)
        .json(utils.makeResponseJson('', { ...data, results }, OK));
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const Similar = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<SimilarProps>(
        `/movie/${req?.params?.movieId}/similar`,
        {
          params: {
            ...req?.query,
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );
      const results = data?.results
        ?.sort((a, b) => b.popularity - a.popularity)
        ?.map((result) => {
          return {
            backdropPath:
              result?.backdrop_path &&
              `${tmdbImageURL}${result?.backdrop_path}`,
            id: result?.id,
            title: result?.title,
            originalLanguage: result?.original_language,
            originalTitle: result?.original_title,
            overview: result?.overview,
            posterPath:
              result?.poster_path && `${tmdbImageURL}${result?.poster_path}`,
            mediaType: 'movie',
            genreIds: result?.genre_ids,
            popularity: result?.popularity,
            releaseDate: result?.release_date,
            video: result?.video,
            voteAverage: result?.vote_average,
            voteCount: result?.vote_count,
          };
        });

      return res
        .status(OK)
        .json(utils.makeResponseJson('', { ...data, results }, OK));
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const Videos = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<VideosProps>(
        `/movie/${req.params.movieId}/videos`,
        {
          params: {
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );
      const results = data?.results?.map((result) => {
        return {
          iso_639_1: result?.iso_639_1,
          iso_3166_1: result?.iso_3166_1,
          name: result?.name,
          key: result?.key,
          site: result?.site,
          size: result?.size,
          type: result?.type,
          official: result?.official,
          id: result?.id,
          publishedAt: moment(result?.published_at).format('LL'),
        };
      });
      let types = data.results.map((item) => {
        return item.type;
      });
      types = _.uniqWith(types, _.isEqual);
      return res
        .status(OK)
        .json(utils.makeResponseJson('', { ...data, results, types }, OK));
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const watchProviders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<WatchProvidersProps>(
        `/movie/${req.params.movieId}/watch/providers`,
      );
      const language =
        req.headers['accept-language'] === 'tr'
          ? req.headers['accept-language'].toUpperCase()
          : 'US';
      const providers = {
        ...data?.results?.[language],
        buy: data?.results?.[language]?.buy?.map((item) => {
          return {
            logoPath: item?.logo_path && `${tmdbImageURL}${item?.logo_path}`,
            provider_id: item?.provider_id,
            provider_name: item?.provider_name,
            display_priority: item?.display_priority,
          };
        }),
        flatrate: data?.results?.[language]?.flatrate?.map((item) => {
          return {
            logoPath: item?.logo_path && `${tmdbImageURL}${item?.logo_path}`,
            provider_id: item?.provider_id,
            provider_name: item?.provider_name,
            display_priority: item?.display_priority,
          };
        }),
        rent: data?.results?.[language]?.rent?.map((item) => {
          return {
            logoPath: item?.logo_path && `${tmdbImageURL}${item?.logo_path}`,
            provider_id: item?.provider_id,
            provider_name: item?.provider_name,
            display_priority: item?.display_priority,
          };
        }),
      };
      return res
        .status(OK)
        .json(utils.makeResponseJson('', { id: data?.id, providers }, OK));
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const nowPlaying = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const region =
      req.headers['accept-language'] === 'tr'
        ? req.headers['accept-language'].toUpperCase()
        : 'US';
    try {
      const { data } = await tmdbAPI.get<NowPlayingProps>(
        `/movie/now_playing`,
        {
          params: {
            ...req?.query,
            region: region,
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );
      const results = data?.results
        ?.sort((a, b) => {
          return b.popularity - a.popularity;
        })
        ?.map((result) => {
          return {
            adult: result?.adult,
            backdropPath:
              result?.backdrop_path &&
              `${tmdbImageURL}${result?.backdrop_path}`,
            genreIds: result?.genre_ids,
            id: result?.id,
            originalLanguage: result?.original_language,
            originalTitle: result?.original_title,
            overview: result?.overview,
            popularity: result?.popularity,
            posterPath:
              result?.poster_path && `${tmdbImageURL}${result?.poster_path}`,
            releaseDate: moment(result?.release_date).format('LL'),
            title: result?.title,
            video: result?.video,
            voteAverage: result?.vote_average,
            voteCount: result?.vote_count,
          };
        });

      return res
        .status(OK)
        .json(utils.makeResponseJson('', { ...data, results }, OK));
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const Popular = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const region =
      req.headers['accept-language'] === 'tr'
        ? req.headers['accept-language'].toUpperCase()
        : 'US';
    try {
      const { data } = await tmdbAPI.get<PopularProps>(`/movie/popular`, {
        params: {
          region,
          language: `${req.headers['accept-language']}-US`,
          ...req.query,
        },
      });

      const results = data?.results
        ?.sort((a, b) => {
          return b.popularity - a.popularity;
        })
        ?.map((result) => {
          return {
            backdropPath:
              result?.backdrop_path &&
              `${tmdbImageURL}${result?.backdrop_path}`,
            genreIds: result?.genre_ids,
            id: result?.id,
            posterPath:
              result?.poster_path && `${tmdbImageURL}${result?.poster_path}`,
            title: result?.title,
            mediaType: 'movie',
            vote: Math.floor(result.vote_average * 10),
          };
        });

      return res
        .status(OK)
        .json(utils.makeResponseJson('', { ...data, results }, OK));
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const topRated = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const region =
      req.headers['accept-language'] === 'tr'
        ? req.headers['accept-language'].toUpperCase()
        : 'US';
    try {
      const { data } = await tmdbAPI.get<TopRatedProps>(`/movie/top_rated`, {
        params: {
          ...req?.query,
          region,
          language: `${req.headers['accept-language']}-US`,
        },
      });
      const results = data?.results
        ?.sort((a, b) => {
          return b.popularity - a.popularity;
        })
        ?.map((result) => {
          return {
            adult: result?.adult,
            backdropPath:
              result?.backdrop_path &&
              `${tmdbImageURL}${result?.backdrop_path}`,
            genreIds: result?.genre_ids,
            id: result?.id,
            originalLanguage: result?.original_language,
            originalTitle: result?.original_title,
            overview: result?.overview,
            popularity: result?.popularity,
            posterPath:
              result?.poster_path && `${tmdbImageURL}${result?.poster_path}`,
            releaseDate: moment(result?.release_date).format('LL'),
            title: result?.title,
            video: result?.video,
            voteAverage: result?.vote_average,
            voteCount: result?.vote_count,
          };
        });

      return res
        .status(OK)
        .json(utils.makeResponseJson('', { ...data, results }, OK));
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const Upcoming = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const region =
      req.headers['accept-language'] === 'tr'
        ? req.headers['accept-language'].toUpperCase()
        : 'US';

    try {
      const { data } = await tmdbAPI.get<UpcomingProps>(`/movie/upcoming`, {
        params: {
          ...req?.query,
          region,
          language: `${req.headers['accept-language']}-US`,
        },
      });
      const results = data?.results
        ?.sort((a, b) => {
          return b.popularity - a.popularity;
        })
        ?.map((result) => {
          return {
            adult: result?.adult,
            backdropPath:
              result?.backdrop_path &&
              `${tmdbImageURL}${result?.backdrop_path}`,
            genreIds: result?.genre_ids,
            id: result?.id,
            originalLanguage: result?.original_language,
            originalTitle: result?.original_title,
            overview: result?.overview,
            popularity: result?.popularity,
            posterPath:
              result?.poster_path && `${tmdbImageURL}${result?.poster_path}`,
            releaseDate: moment(result?.release_date).format('LL'),
            title: result?.title,
            video: result?.video,
            voteAverage: result?.vote_average,
            voteCount: result?.vote_count,
          };
        });

      return res
        .status(OK)
        .json(utils.makeResponseJson('', { ...data, results }, OK));
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const shortDetail = asyncHandler(async (req: Request, res: Response) => {
  const { data } = await tmdbAPI.get<MovieDetailProps>(
    `/movie/${req.params.movieId}`,
    {
      params: {
        language: `${req.headers['accept-language']}-US`,
      },
    },
  );
  const result = {
    backdropPath: data.backdrop_path && `${tmdbImageURL}${data.backdrop_path}`,
    genres: data.genres,
    id: data.id,
    posterPath: data.poster_path && `${tmdbImageURL}${data.poster_path}`,
    title: data.title,
  };
  return res.status(OK).json(utils.makeResponseJson('', result, OK));
});

export {
  Detail,
  Credits,
  externalIDs,
  Images,
  Keywords,
  Recommendations,
  Similar,
  Videos,
  watchProviders,
  nowPlaying,
  Popular,
  topRated,
  Upcoming,
  shortDetail,
};
