import i18next from 'i18next';
import { OK, NOT_FOUND } from 'http-status';
import _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
import moment from 'moment';

import { asyncHandler, customError, utils } from '@scripts/index';
import { tmdbAPI } from '@api/index';
import { tmdbImageURL } from '@constants/index';
import {
  SeriesDetailProps,
  CreditsProps,
  ExternalIDsProps,
  ImagesProps,
  RecommendationsProps,
  SimilarProps,
  VideosProps,
  WatchProvidersProps,
  PopularProps,
  TopRatedProps,
} from 'type/media/tv/series';

const Detail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<SeriesDetailProps>(
        `/tv/${req?.params?.tvId}`,
        {
          params: {
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );
      const createdBy = data?.created_by?.map((item) => {
        return {
          id: item?.id,
          creditId: item?.credit_id,
          name: item?.name,
          gender: i18next.t(`gender.${item?.gender}`),
          profilePath:
            item?.profile_path && `${tmdbImageURL}${item?.profile_path}`,
        };
      });
      const episodeRunTime = data?.episode_run_time?.map((item) => {
        return item && utils.runTime(item, req.headers['accept-language']);
      });
      const seasons = data?.seasons?.map((item) => {
        return {
          airDate: moment(item?.air_date).format('LL'),
          episodeCount: item?.episode_count,
          id: item?.id,
          name: item?.name,
          overview: item?.overview,
          posterPath:
            item?.poster_path && `${tmdbImageURL}${item?.poster_path}`,
          seasonNumber: item?.season_number,
        };
      });

      const result = {
        adult: data?.adult,
        backdropPath:
          data?.backdrop_path && `${tmdbImageURL}${data?.backdrop_path}`,
        createdBy,
        episodeRunTime,
        firstAirDate: moment(data?.first_air_date).format('LL'),
        genres: data?.genres,
        id: data?.id,
        inProduction: data?.in_production,
        languages: data?.languages,
        lastAirDate: moment(data?.last_air_date).format('LL'),
        lastEpisodeToAir: {
          airDate: moment(data?.last_episode_to_air?.air_date).format('LL'),
          episodeNumber: data?.last_episode_to_air?.episode_number,
          id: data?.last_episode_to_air?.id,
          name: data?.last_episode_to_air?.name,
          overview: data?.last_episode_to_air?.overview,
          productionCode: data?.last_episode_to_air?.production_code,
          runTime:
            data?.last_episode_to_air?.runTime &&
            utils.runTime(
              data?.last_episode_to_air?.runTime,
              req.headers['accept-language'],
            ),
          seasonNumber: data?.last_episode_to_air?.season_number,
          showId: data?.last_episode_to_air?.show_id,
          stillPath:
            data?.last_episode_to_air?.still_path &&
            `${tmdbImageURL}${data?.last_episode_to_air?.still_path}`,
          voteAverage: data?.last_episode_to_air?.vote_average,
          voteCount: data?.last_episode_to_air?.vote_count,
        },
        name: data?.name,
        nextEpisodeToAir: data?.next_episode_to_air,
        numberOfEpisodes: data?.number_of_episodes,
        numberOfSeasons: data?.number_of_seasons,
        originCountry: data?.origin_country,
        originalLanguage: data?.original_language,
        originalName: data?.original_name,
        overview: data?.overview,
        popularity: data?.popularity,
        posterPath: data?.poster_path && `${tmdbImageURL}${data?.poster_path}`,
        seasons,
        status: i18next.t(`movie.status.${data?.status}`),
        tagline: data?.tagline,
        type: data?.type,
        voteAverage: data?.vote_average,
        voteCount: data?.vote_count,
      };
      return res.status(OK).json(utils.makeResponseJson('', result, OK));
    } catch (err) {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const Credits = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<CreditsProps>(
        `/tv/${req?.params?.tvId}/credits`,
        {
          params: {
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );
      const cast = data?.cast
        ?.sort((a, b) => b?.popularity - a?.popularity)
        ?.map((cast) => {
          return {
            adult: cast?.adult,
            gender: i18next.t(`gender.${cast?.gender}`),
            id: cast?.id,
            knownForDepartment: cast?.known_for_department,
            name: cast?.name,
            originalName: cast?.original_name,
            popularity: cast?.popularity,
            profilePath:
              cast?.profile_path && `${tmdbImageURL}${cast?.profile_path}`,
            character: cast?.character,
            creditId: cast?.credit_id,
            order: cast?.order,
          };
        });

      const crew = data?.crew
        ?.sort((a, b) => b?.popularity - a?.popularity)
        ?.map((crew) => {
          return {
            adult: crew?.adult,
            gender: i18next.t(`gender.${crew?.gender}`),
            id: crew?.id,
            knownForDepartment: crew?.known_for_department,
            name: crew?.name,
            originalName: crew?.original_name,
            popularity: crew?.popularity,
            profilePath:
              crew?.profile_path && `${tmdbImageURL}${crew?.profile_path}`,
            creditId: crew?.credit_id,
            department: crew?.department,
            job: crew?.job,
          };
        });
      return res
        .status(OK)
        .json(utils.makeResponseJson('', { ...data, cast, crew }, OK));
    } catch (err) {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const externalIDs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<ExternalIDsProps>(
        `/tv/${req.params.tvId}/external_ids`,
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
        `/tv/${req.params.tvId}/images`,
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
    } catch (err) {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const Recommendations = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<RecommendationsProps>(
        `/tv/${req.params.tvId}/recommendations`,
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
            posterPath:
              result?.poster_path && `${tmdbImageURL}${result?.poster_path}`,
            popularity: result?.popularity,
            id: result?.id,
            backdropPath:
              result?.backdrop_path &&
              `${tmdbImageURL}${result?.backdrop_path}`,
            voteAverage: result?.vote_average,
            overview: result?.overview,
            firstAirDate: moment(result?.first_air_date).format('LL'),
            originCountry: result?.origin_country,
            genreIds: result?.genre_ids,
            originalLanguage: result?.original_language,
            voteCount: result?.vote_count,
            name: result?.name,
            originalName: result?.original_name,
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
        `/tv/${req.params.tvId}/similar`,
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
            posterPath:
              result?.poster_path && `${tmdbImageURL}${result?.poster_path}`,
            popularity: result?.popularity,
            id: result?.id,
            backdropPath:
              result?.backdrop_path &&
              `${tmdbImageURL}${result?.backdrop_path}`,
            voteAverage: result?.vote_average,
            overview: result?.overview,
            firstAirDate: moment(result?.first_air_date).format('LL'),
            originCountry: result?.origin_country,
            genreIds: result?.genre_ids,
            originalLanguage: result?.original_language,
            voteCount: result?.vote_count,
            name: result?.name,
            originalName: result?.original_name,
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
        `/tv/${req.params.tvId}/videos`,
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
        `/tv/${req.params.tvId}/watch/providers`,
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

const Popular = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<PopularProps>('/tv/popular', {
        params: {
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
            posterPath:
              result?.poster_path && `${tmdbImageURL}${result?.poster_path}`,
            id: result?.id,
            backdropPath:
              result?.backdrop_path &&
              `${tmdbImageURL}${result?.backdrop_path}`,
            genreIds: result?.genre_ids,
            title: result?.name,
            mediaType: 'tv',
            vote: Math.floor(result.vote_average * 10),
          };
        });
      return res
        .status(OK)
        .json(utils.makeResponseJson('', { ...data, results }, OK));
    } catch (err) {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const topRated = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await tmdbAPI.get<TopRatedProps>('/tv/top_rated', {
        params: {
          ...req.query,
          language: `${req.headers['accept-language']}-US`,
        },
      });
      const results = data?.results
        ?.sort((a, b) => b.popularity - a.popularity)
        ?.map((result) => {
          return {
            posterPath:
              result?.poster_path && `${tmdbImageURL}${result?.poster_path}`,
            popularity: result?.popularity,
            id: result?.id,
            backdropPath:
              result?.backdrop_path &&
              `${tmdbImageURL}${result?.backdrop_path}`,
            voteAverage: result?.vote_average,
            overview: result?.overview,
            firstAirDate: moment(result?.first_air_date).format('LL'),
            originCountry: result?.origin_country,
            genreIds: result?.genre_ids,
            originalLanguage: result?.original_language,
            voteCount: result?.vote_count,
            name: result?.name,
            originalName: result?.original_name,
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
  const { data } = await tmdbAPI.get<SeriesDetailProps>(
    `/tv/${req.params.tvId}`,
  );

  const result = {
    backdropPath: data.backdrop_path && `${tmdbImageURL}${data.backdrop_path}`,
    genres: data.genres,
    id: data.id,
    title: data.name,
    posterPath: data.poster_path && `${tmdbImageURL}${data.poster_path}`,
  };
  return res.status(OK).json(utils.makeResponseJson('', result, OK));
});

export {
  Detail,
  Credits,
  externalIDs,
  Images,
  Recommendations,
  Similar,
  Videos,
  watchProviders,
  Popular,
  topRated,
  shortDetail,
};
