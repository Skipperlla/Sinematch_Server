import { Request, Response, NextFunction } from 'express';
import { NOT_FOUND, OK } from 'http-status';
import i18next from 'i18next';
import moment from 'moment';
import _ from 'lodash';

import { asyncHandler, customError, utils } from '@scripts/index';
import { tmdbAPI } from '@api/index';
import {
  DetailProps,
  CreditsProps,
  ImagesProps,
  VideosProps,
} from 'type/media/tv/season';
import { tmdbImageURL } from '@constants/index';

const Detail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { seasonNumber, tvId } = req.params;
      const { data } = await tmdbAPI.get<DetailProps>(
        `/tv/${tvId}/season/${seasonNumber}`,
        {
          params: {
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );
      const episodes = data?.episodes?.map((episode) => {
        return {
          airDate: moment(episode?.air_date).format('LL'),
          episodeNumber: episode?.episode_number,
          id: episode?.id,
          name: episode?.name,
          overview: episode?.overview,
          productionCode: episode?.production_code,
          runTime:
            episode?.runtime &&
            utils.runTime(episode?.runtime, req.headers['accept-language']),
          seasonNumber: episode?.season_number,
          showId: episode?.show_id,
          stillPath:
            episode?.still_path && `${tmdbImageURL}${episode?.still_path}`,
          voteAverage: episode?.vote_average,
          voteCount: episode?.vote_count,
          crew: episode?.crew
            ?.sort((a, b) => b.popularity - a.popularity)
            ?.map((crew) => {
              return {
                department: crew?.department,
                job: crew?.job,
                creditId: crew?.credit_id,
                adult: crew?.adult,
                gender: i18next.t(`gender.${crew?.gender}`),
                id: crew?.id,
                knownForDepartment: crew?.known_for_department,
                name: crew?.name,
                originalName: crew?.original_name,
                popularity: crew?.popularity,
                profilePath:
                  crew?.profile_path && `${tmdbImageURL}${crew?.profile_path}`,
              };
            }),
          guestStars: episode?.guest_stars
            ?.sort((a, b) => b.popularity - a.popularity)
            ?.map((guestStar) => {
              return {
                character: guestStar?.character,
                creditId: guestStar?.credit_id,
                order: guestStar?.order,
                adult: guestStar?.adult,
                gender: i18next.t(`gender.${guestStar?.gender}`),
                id: guestStar?.id,
                knownForDepartment: guestStar?.known_for_department,
                name: guestStar?.name,
                originalName: guestStar?.original_name,
                popularity: guestStar?.popularity,
                profilePath:
                  guestStar?.profile_path &&
                  `${tmdbImageURL}${guestStar?.profile_path}`,
              };
            }),
        };
      });
      const result = {
        _id: data?._id,
        airDate: moment(data?.air_date).format('LL'),
        name: data?.name,
        overview: data?.overview,
        id: data?.id,
        posterPath: data?.poster_path && `${tmdbImageURL}${data?.poster_path}`,
        seasonNumber: data?.season_number,
        episodes,
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
      const { seasonNumber, tvId } = req.params;

      const { data } = await tmdbAPI.get<CreditsProps>(
        `/tv/${tvId}/season/${seasonNumber}/credits`,
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
        ?.sort((a, b) => b.popularity - a.popularity)
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
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const Images = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tvId, seasonNumber } = req.params;
      const { data } = await tmdbAPI.get<ImagesProps>(
        `/tv/${tvId}/season/${seasonNumber}/images`,
        {
          params: {
            include_image_language: req.headers['accept-language'],
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );

      const posters = data?.posters?.map((backdrop) => {
        return {
          ...backdrop,
          filePath:
            backdrop?.file_path && `${tmdbImageURL}${backdrop?.file_path}`,
        };
      });

      return res
        .status(OK)
        .json(utils.makeResponseJson('', { ...data, posters }, OK));
    } catch (err) {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const Videos = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tvId, seasonNumber } = req.params;
      const { data } = await tmdbAPI.get<VideosProps>(
        `/tv/${tvId}/season/${seasonNumber}/videos`,
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

export { Detail, Credits, Images, Videos };
