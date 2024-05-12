import { Request, Response } from 'express';
import { OK } from 'http-status';

import { GenreSchema } from '@schemas/index';
import { asyncHandler, utils } from '@scripts/index';
import { tmdbAPI, mediaAPI } from '@api/index';
import { tmdbImageURL } from '@constants/index';
import type {
  MultiSearchProps,
  SearchMovieProps,
  SeriesProps,
  PopularProps,
} from 'type/media/search';

const Movie = asyncHandler(async (req: Request, res: Response) => {
  const { data } = await tmdbAPI.get<SearchMovieProps>(`/search/movie`, {
    params: {
      ...req.query,
      language: `${req.headers['accept-language']}-US`,
    },
  });
  const results = data.results
    .sort((a, b) => {
      return b.popularity - a.popularity;
    })
    .map((movie) => {
      return {
        backdropPath:
          movie.backdrop_path && `${tmdbImageURL}${movie.backdrop_path}`,
        genreIds: movie.genre_ids,
        id: movie.id,
        posterPath: movie.poster_path && `${tmdbImageURL}${movie.poster_path}`,
        title: movie.title,
        mediaType: 'movie',
      };
    });

  return res
    .status(OK)
    .json(utils.makeResponseJson('', { ...data, results }, OK));
});

const Series = asyncHandler(async (req: Request, res: Response) => {
  const { data } = await tmdbAPI.get<SeriesProps>(`/search/tv`, {
    params: {
      ...req.query,
      language: `${req.headers['accept-language']}-US`,
    },
  });
  const results = data.results
    .sort((a, b) => b.popularity - a.popularity)
    .map((series) => {
      return {
        backdropPath:
          series.backdrop_path && `${tmdbImageURL}${series.backdrop_path}`,
        genreIds: series.genre_ids,
        id: series.id,
        posterPath:
          series.poster_path && `${tmdbImageURL}${series.poster_path}`,
        title: series.name,
        mediaType: 'tv',
      };
    });

  return res
    .status(OK)
    .json(utils.makeResponseJson('', { ...data, results }, OK));
});

const Multi = asyncHandler(async (req: Request, res: Response) => {
  const { data } = await tmdbAPI.get<MultiSearchProps>('/search/multi', {
    params: {
      ...req.query,
      language: `${req.headers['accept-language']}-US`,
    },
  });
  const results = data.results
    .sort((a, b) => {
      return b.popularity - a.popularity;
    })
    .filter((item) =>
      req?.query?.mediaType
        ? item.media_type === req?.query?.mediaType
        : item.media_type,
    )
    .map((result) => {
      return {
        genreIds: result.genre_ids,
        id: result.id,
        mediaType: result.media_type,
        posterPath:
          (result?.profile_path || result?.poster_path) &&
          `${tmdbImageURL}${result?.poster_path || result?.profile_path}`,
        title: result.title || result.name,
        vote: Math.floor(result.vote_average * 10),
      };
    });
  return res.status(OK).json({ ...data, results });
});
const Genres = asyncHandler(async (req: Request, res: Response) => {
  const genres = await GenreSchema.find().select(
    'name id mediaType registeredUsers',
  );
  genres
    .sort((a, b) => {
      return a.name[req.headers['accept-language']].localeCompare(
        b.name[req.headers['accept-language']],
      );
    })
    .map((genre) => {
      genre.name = genre.name[req.headers['accept-language']];
      return genre;
    });

  return res.status(OK).json(utils.makeResponseJson('', genres, OK));
});

const Popular = asyncHandler(async (req: Request, res: Response) => {
  const { data: movies } = await mediaAPI.get<PopularProps>('/Movie/Popular', {
    params: {
      language: `${req.headers['accept-language']}-US`,
    },
  });
  const { data: series } = await mediaAPI.get<PopularProps>('/Series/Popular', {
    params: {
      language: `${req.headers['accept-language']}-US`,
    },
  });
  const common = [...movies.results.results, ...series.results.results].filter(
    (item) => {
      return req?.query?.mediaType
        ? item.mediaType === req?.query?.mediaType
        : item.mediaType;
    },
  );
  return res.status(OK).json(utils.makeResponseJson('', common, OK));
});

export { Movie, Series, Multi, Genres, Popular };
