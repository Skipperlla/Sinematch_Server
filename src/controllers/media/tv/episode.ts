import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import i18next from 'i18next';
import { NOT_FOUND, OK } from 'http-status';
import _ from 'lodash';

import { asyncHandler, customError, utils } from '@scripts/index';
import { tmdbAPI } from '@api/index';
import { tmdbImageURL } from '@constants/index';
import {
  DetailProps,
  CreditsProps,
  ImagesProps,
  VideosProps,
} from 'type/media/tv/episode';

const Detail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tvId, seasonNumber, episodeNumber } = req.params;
      const { data } = await tmdbAPI.get<DetailProps>(
        `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`,
        {
          params: {
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );
      const crew = data?.crew
        ?.sort((a, b) => b.popularity - a.popularity)
        ?.map((crew) => {
          return {
            department: crew?.department,
            job: crew?.job,
            credit_id: crew?.credit_id,
            adult: crew?.adult,
            gender: i18next.t(`gender.${crew?.gender}`),
            id: crew?.id,
            known_for_department: crew?.known_for_department,
            name: crew?.name,
            original_name: crew?.original_name,
            popularity: crew?.popularity,
            profilePath:
              crew?.poster_path && `${tmdbImageURL}${crew?.poster_path}`,
          };
        });
      const guestStars = data?.guest_stars
        ?.sort((a, b) => b.popularity - a.popularity)
        ?.map((guestStar) => {
          return {
            character: guestStar?.character,
            credit_id: guestStar?.credit_id,
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
        });
      const result = {
        airDate: moment(data?.air_date).format('LL'),
        episodeNumber: data?.episode_number,
        crew,
        guestStars,
        name: data?.name,
        overview: data?.overview,
        id: data?.id,
        productionCode: data?.production_code,
        runTime:
          data?.runtime &&
          utils.runTime(data?.runtime, req.headers['accept-language']),
        seasonNumber: data?.season_number,
        stillPath: data?.still_path && `${tmdbImageURL}${data?.still_path}`,
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
      const { tvId, seasonNumber, episodeNumber } = req.params;

      const { data } = await tmdbAPI.get<CreditsProps>(
        `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/credits`,
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
      const guestStars = data?.guest_stars
        ?.sort((a, b) => b.popularity - a.popularity)
        ?.map((guestStar) => {
          return {
            characterName: guestStar?.character_name,
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
        });
      const result = {
        cast,
        crew,
        guestStars,
        id: data?.id,
      };
      return res.status(OK).json(utils.makeResponseJson('', result, OK));
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const Images = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tvId, seasonNumber, episodeNumber } = req.params;
      const { data } = await tmdbAPI.get<ImagesProps>(
        `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/images`,
        {
          params: {
            include_image_language: req.headers['accept-language'],
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );

      const stills = data?.stills?.map((stills) => {
        return {
          aspectRatio: stills?.aspect_ratio,
          height: stills?.height,
          iso6391: stills?.iso_639_1,
          voteAverage: stills?.vote_average,
          voteCount: stills?.vote_count,
          width: stills?.width,
          filePath: stills?.file_path && `${tmdbImageURL}${stills?.file_path}`,
        };
      });

      return res.status(OK).json(utils.makeResponseJson('', { ...data, stills }, OK));
    } catch {
      return next(new customError('', NOT_FOUND));
    }
  },
);

const Videos = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tvId, seasonNumber, episodeNumber } = req.params;
      const { data } = await tmdbAPI.get<VideosProps>(
        `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/videos`,
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
