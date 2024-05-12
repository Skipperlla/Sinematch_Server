import _ from 'lodash';
import { NextFunction, Response, Request } from 'express';
import { OK, BAD_REQUEST, NOT_FOUND, NO_CONTENT } from 'http-status';

import { asyncHandler, customError, multer, utils } from '@scripts/index';
import {
  ConversationSchema,
  DiscoverySchema,
  GenreSchema,
  UserSchema,
} from '@schemas/index';
import { compareMatchPercent } from '@scripts/index';
import { replicateAPI, tmdbAPI } from '@api/index';
import { tmdbImageURL } from '@constants/index';
import type { MovieDetailProps } from 'type/media/movie';
import type { SeriesDetailProps } from 'type/media/tv/series';
import { io } from '@loaders/socket';

const isLoggedIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserSchema.findById(req.user._id).select(
      'fullName userName notifications discoverySettings matchResetCountdown email info avatars plan uuid matchLikeCount genres favMovies favSeries',
    );

    if (!user) return next(new customError('errors.notFoundUser', NOT_FOUND));

    return res.status(OK).json(utils.makeResponseJson('', user, OK));
  },
);

const Favorites = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserSchema.findOne({
    uuid: req.params.userId,
  })
    .select('favMovies favSeries genres fullName userName info avatars uuid')
    .populate('genres', 'id');

  const genreSchema = (await GenreSchema.find()).map((genre) => {
    genre.name = genre.name[req.headers['accept-language']];
    return genre;
  });

  const genreIds = [
    ...user.favMovies
      .map((movie) => {
        return movie?.genreIds;
      })
      .flat(),
    ...user.favSeries
      .map((series) => {
        return series?.genreIds;
      })
      .flat(),
    ...user.genres.map((genre) => {
      return genre?.id;
    }),
  ];

  const fetchMovies = user?.favMovies?.map(async (movie) => {
    try {
      const { data } = await tmdbAPI.get<MovieDetailProps>(
        `/movie/${movie?.id}`,
        {
          params: {
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );
      return {
        backdropPath:
          data?.backdrop_path && `${tmdbImageURL}${data.backdrop_path}`,
        id: data?.id,
        posterPath: data?.poster_path && `${tmdbImageURL}${data?.poster_path}`,
        title: data?.title,
      };
    } catch (err) {
      console.log(err.data);
    }
  });

  const fetchSeries = user?.favSeries?.map(async (series) => {
    try {
      const { data } = await tmdbAPI.get<SeriesDetailProps>(
        `/tv/${series?.id}`,
        {
          params: {
            language: `${req.headers['accept-language']}-US`,
          },
        },
      );
      return {
        backdropPath:
          data?.backdrop_path && `${tmdbImageURL}${data?.backdrop_path}`,
        id: data?.id,
        posterPath: data?.poster_path && `${tmdbImageURL}${data?.poster_path}`,
        title: data?.name,
      };
    } catch (err) {
      console.log(err.data);
    }
  });

  const genres = utils.totalSameElement(genreIds, genreSchema);

  return res.status(OK).json(
    utils.makeResponseJson(
      '',
      {
        genres,
        movies: _.chunk(_.compact(await Promise.all(fetchMovies)), 6),
        series: _.chunk(_.compact(await Promise.all(fetchSeries)), 6),
      },
      OK,
    ),
  );
});

const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserSchema.findByIdAndUpdate(
    req.user._id,
    {
      $set: req.body,
    },
    {
      new: true,
    },
  ).select('userName info fullName email plan');

  return res.status(OK).json(utils.makeResponseJson('', user, OK));
});
const updateInfo = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.user;
  const { info } = await UserSchema.findById(_id).select('info');

  const user = await UserSchema.findByIdAndUpdate(
    _id,

    {
      $set: {
        info: {
          ...info,
          ...req.body,
        },
      },
    },
    {
      new: true,
    },
  ).select('info');

  return res.status(OK).json(utils.makeResponseJson('', user, OK));
});
// TODO: S3 SDK guncellendigi zaman buraya tekrar bakilir
const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  const { _id, uuid } = req.user;
  const {
    Location,
    Key: key,
    ETag,
    Bucket,
  } = await multer.avatarUpload(req.file, uuid, 'Avatars');

  const { avatars } = await UserSchema.findById(_id);

  const ai = await replicateAPI.post('', {
    version: 'fe1c4d2fd6a5db338800310bef284a4a72285d810e9df975532defa48275e204',
    input: {
      image: Location,
    },
  });
  const aiInterval = setInterval(async () => {
    const respons = await replicateAPI.post(`/${ai.data.id}`);
    console.log(respons.data);
  }, 2500);

  clearInterval(aiInterval);

  const user = await UserSchema.findByIdAndUpdate(
    _id,
    {
      $push: {
        avatars: {
          Location,
          key,
          ETag,
          Bucket,
          index: avatars?.length ? avatars?.length : 0,
          createdAt: new Date(),
        },
      },
    },
    { new: true },
  ).select('avatars');

  return res
    .status(OK)
    .json(
      utils.makeResponseJson(
        'controllers.user.user.uploadPhoto',
        user.avatars[user.avatars.length - 1],
        OK,
      ),
    );
});
const deleteAvatar = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { key, Bucket } = req.body;
    const { _id } = req.user;
    try {
      multer.removeAvatar(key, Bucket);
      const { avatars } = await UserSchema.findOneAndUpdate(
        { _id, 'avatars.key': key },
        {
          $pull: {
            avatars: { key },
          },
        },
        { new: true, runValidators: true },
      );
      const newIndexedAvatars = avatars?.map((avatar, index) => {
        return {
          ...avatar,
          index,
        };
      });

      await UserSchema.findByIdAndUpdate(
        _id,
        {
          $set: {
            avatars: newIndexedAvatars,
          },
        },
        { new: true, runValidators: true },
      );
      return res.status(OK).json(utils.makeResponseJson('', { key }, OK));
    } catch (err) {
      return next(new customError('', BAD_REQUEST));
    }
  },
);
const changePrimaryAvatar = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id, uuid } = req.user;
    const user = await UserSchema.findById(_id);

    try {
      multer.removeAvatar(user.avatars[0].key, user.avatars[0].Bucket);
      const {
        Location,
        Key: key,
        ETag,
        Bucket,
      } = await multer.avatarUpload(req.file, uuid, 'Avatars');

      user.avatars[0] = {
        Location,
        key,
        ETag,
        Bucket,
        createdAt: new Date(),
        index: 1,
      };
      await user.save();
      return res
        .status(OK)
        .json(utils.makeResponseJson('', user.avatars[0], OK));
    } catch (err) {
      return next(new customError('', BAD_REQUEST));
    }
  },
);
const avatarSequenceChange = asyncHandler(
  async (req: Request, res: Response) => {
    const avatars = req.body.avatars;
    const cleanedAvatars = _.filter(avatars, function (avatar) {
      return avatar.Location !== '';
    });

    await UserSchema.findByIdAndUpdate(
      req.user._id,
      { avatars: cleanedAvatars },
      {
        new: true,
        runValidators: true,
      },
    );
    return res.status(OK).json(utils.makeResponseJson('', null, OK));
  },
);

const addGenre = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.user;
  const genres = req.body.genres;

  const user = await UserSchema.findByIdAndUpdate(
    _id,
    {
      $addToSet: { genres },
    },
    { new: true },
  ).select('genres');

  await GenreSchema.updateMany(
    {
      _id: { $in: genres },
    },
    {
      $addToSet: { registeredUsers: _id },
    },
    {
      new: true,
    },
  );
  return res.status(OK).json(utils.makeResponseJson('', user.genres, OK));
});

const deleteGenre = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.user;
  const genres = req.body.genres;
  const user = await UserSchema.findByIdAndUpdate(
    _id,
    {
      $pullAll: { genres },
    },
    { new: true },
  ).select('genres');
  await GenreSchema.updateMany(
    {
      _id: { $in: genres },
    },
    {
      $pull: { registeredUsers: _id },
    },
    {
      new: true,
    },
  );
  return res.status(OK).json(utils.makeResponseJson('', user.genres, OK));
});
const addFav = asyncHandler(async (req: Request, res: Response) => {
  const data = _.map(req.body.favorites, (fav) =>
    _.pick(fav, ['id', 'mediaType', 'genreIds']),
  );
  const { movie, tv: series } = _.groupBy(data, 'mediaType');

  const user = await UserSchema.findByIdAndUpdate(
    req.user._id,
    {
      // $addToSet: {
      //   favMovies: { $each: movie ?? [] },
      //   favSeries: { $each: series ?? [] },
      // },
      favMovies: movie ?? [],
      favSeries: series ?? [],
    },
    { new: true },
  ).select('favMovies favSeries');

  return res.status(OK).json(
    utils.makeResponseJson(
      '',
      {
        favMovies: user.favMovies,
        favSeries: user.favSeries,
      },
      OK,
    ),
  );
});

const removeFav = asyncHandler(async (req: Request, res: Response) => {
  const data = _.map(req.body.favorites, (fav) =>
    _.pick(fav, ['id', 'mediaType', 'genreIds']),
  );
  const { movie, tv: series } = _.groupBy(data, 'mediaType');

  const user = await UserSchema.findByIdAndUpdate(
    req.user._id,
    {
      $pullAll: {
        favMovies: movie ?? [],
        favSeries: series ?? [],
      },
    },
    { new: true },
  ).select('favMovies favSeries');

  return res.status(OK).json(
    utils.makeResponseJson(
      '',
      {
        favMovies: user.favMovies,
        favSeries: user.favSeries,
      },
      OK,
    ),
  );
});

const searchUser = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.user;
  const { blocks } = await UserSchema.findById(_id);

  const users = await UserSchema.find({
    userName: new RegExp('^' + req.query.q + '$', 'i'),
    _id: { $nin: blocks },
  }).select('uuid avatars.Location fullName userName');

  return res.status(OK).json(utils.makeResponseJson('', users, OK));
});
const blockUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;
    const { _id } = req.user;
    const user = await UserSchema.findOne({ uuid: userId });
    // TODO: User exits eklenicek middleware'a
    if (!user) return next(new customError('errors.notFoundUser', NOT_FOUND));
    await UserSchema.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { blocks: user._id },
      },
      {
        new: true,
      },
    );
    await DiscoverySchema.findOneAndDelete({
      $or: [
        {
          sender: user._id,
          receiver: _id,
        },
        {
          sender: _id,
          receiver: user._id,
        },
      ],
    });

    return res.status(OK).json(utils.makeResponseJson('', { userId }, OK));
  },
);
const unBlockUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserSchema.findOne({ uuid: req.body.userId });

    if (!user) return next(new customError('errors.notFoundUser', NOT_FOUND));

    await UserSchema.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { blocks: user._id },
      },
      {
        new: true,
      },
    );

    return res
      .status(NO_CONTENT)
      .json(utils.makeResponseJson('', undefined, NO_CONTENT));
  },
);

const Notification = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserSchema.findByIdAndUpdate(
    req.user._id,
    {
      $set: { notifications: req.body },
    },
    {
      new: true,
    },
  ).select('notifications');

  return res
    .status(OK)
    .json(utils.makeResponseJson('', user.notifications, OK));
});
const discoverySettings = asyncHandler(async (req: Request, res: Response) => {
  const ageRange = {
    min: new Date(req.body.ageRange.min),
    max: new Date(req.body.ageRange.max),
  };
  const user = await UserSchema.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        discoverySettings: { ...req.body, ageRange },
      },
    },
    {
      new: true,
    },
  ).select('discoverySettings');

  return res
    .status(OK)
    .json(utils.makeResponseJson('', user.discoverySettings, OK));
});

const Compare = asyncHandler(async (req: Request, res: Response) => {
  try {
    const sender = await UserSchema.findById(req.user._id)
      .select('favMovies favSeries genres')
      .populate('genres', 'id');
    const receiver = await UserSchema.findOne({
      uuid: req.params.userId,
    })
      .select('genres favMovies favSeries fullName avatars info')
      .populate('genres', 'id');

    const senderData = {
      favorites: [...sender.favMovies, ...sender.favSeries],
      genres: [
        ...sender.favMovies
          .map((movie) => {
            return movie?.genreIds;
          })
          .flat(),
        ...sender.favSeries
          .map((series) => {
            return series?.genreIds;
          })
          .flat(),
        ...sender.genres.map((genre) => {
          return genre?.id;
        }),
      ],
    };

    const receiverData = {
      favorites: [...receiver.favMovies, ...receiver.favSeries],
      genres: [
        ...receiver.favMovies
          .map((movie) => {
            return movie?.genreIds;
          })
          .flat(),
        ...receiver.favSeries
          .map((series) => {
            return series?.genreIds;
          })
          .flat(),
        ...receiver.genres.map((genre) => {
          return genre?.id;
        }),
      ],
    };
    const fetchReceiverMedia = await Promise.all(
      receiverData?.favorites?.map(async (item) => {
        const { data } = await tmdbAPI.get<MovieDetailProps>(
          `/${item.mediaType === 'movie' ? 'movie' : 'tv'}/${item.id}`,
          {
            params: {
              language: `${req.headers['accept-language']}-US`,
            },
          },
        );
        return {
          backdropPath:
            data.backdrop_path && `${tmdbImageURL}${data.backdrop_path}`,
          id: data.id,
          posterPath: data.poster_path && `${tmdbImageURL}${data.poster_path}`,
          title: data.title ?? data.name,
          mediaType: item.mediaType,
        };
      }),
    );

    const common = {
      commonFavorites: _.intersectionWith(
        fetchReceiverMedia,
        senderData?.favorites,
        (senderItem, receiverItem) => senderItem.id === receiverItem.id,
      ),
      totalFavorites: _.union(senderData?.favorites, receiverData?.favorites)
        .length,
      totalGenres: senderData?.genres?.length + receiverData?.genres?.length,
      genres: senderData?.genres?.filter((o1) => {
        return receiverData?.genres?.some((o2) => {
          return o1 === o2;
        });
      }),
    };

    const { movie, tv: series } = _.groupBy(
      common.commonFavorites,
      'mediaType',
    );
    const { movie: receiverMovie, tv: receiverSeries } = _.groupBy(
      fetchReceiverMedia,
      'mediaType',
    );

    const genreSchema = (await GenreSchema.find()).map((genre) => {
      genre.name = genre.name[req.headers['accept-language']];
      return genre;
    });

    const commonGenres = utils.totalSameElement(common?.genres, genreSchema);
    const userGenres = utils.totalSameElement(
      receiverData?.genres,
      genreSchema,
    );

    const matchPercent = compareMatchPercent.calculateCombinedMatchRatio(
      common.commonFavorites.length,
      common.genres.length,
      common.totalFavorites,
      common.totalGenres,
    );

    return res.status(OK).json(
      utils.makeResponseJson(
        '',
        {
          commonGenres,
          matchPercent,
          movie: _.chunk(movie, 6),
          series: _.chunk(series, 6),
          receiverMedia: {
            movie: _.chunk(receiverMovie, 6),
            series: _.chunk(receiverSeries, 6),
            genres: userGenres,
          },
          receiver,
        },
        OK,
      ),
    );
  } catch (err) {
    console.log(err.data);
  }
});

const matchPercent = asyncHandler(async (req: Request, res: Response) => {
  const sender = await UserSchema.findById(req.user._id)
    .select('favMovies favSeries genres')
    .populate('genres', 'id');

  const receiver = await UserSchema.findOne({
    uuid: req.params.userId,
  })
    .select('favMovies favSeries genres')
    .populate('genres', 'id');

  const senderData = {
    favorites: [...sender.favMovies, ...sender.favSeries],
    genres: [
      ...sender.favMovies
        .map((movie) => {
          return movie?.genreIds;
        })
        .flat(),
      ...sender.favSeries
        .map((series) => {
          return series?.genreIds;
        })
        .flat(),
      ...sender.genres.map((genre) => {
        return genre?.id;
      }),
    ],
  };
  const receiverData = {
    favorites: [...receiver.favMovies, ...receiver.favSeries],
    genres: [
      ...receiver.favMovies
        .map((movie) => {
          return movie?.genreIds;
        })
        .flat(),
      ...receiver.favSeries
        .map((series) => {
          return series?.genreIds;
        })
        .flat(),
      ...receiver.genres.map((genre) => {
        return genre?.id;
      }),
    ],
  };
  const common = {
    commonFavorites: _.intersectionWith(
      senderData?.favorites,
      receiverData?.favorites,
      (meItem, userItem) => meItem.id === userItem.id,
    ),
    totalFavorites: _.union(senderData?.favorites, receiverData?.favorites)
      .length,
    totalGenres: senderData.genres.length + receiverData.genres.length,
    genres: receiverData?.genres?.filter((o1) => {
      return senderData?.genres?.some((o2) => {
        return o1 === o2;
      });
    }),
  };
  const matchPercent = compareMatchPercent.calculateCombinedMatchRatio(
    common.commonFavorites.length,
    common.genres.length,
    common.totalFavorites,
    common.totalGenres,
  );
  return res.status(OK).json(utils.makeResponseJson('', { matchPercent }, OK));
});

const setLocation = asyncHandler(async (req: Request, res: Response) => {
  const data = {
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude],
  };

  await UserSchema.findByIdAndUpdate(
    req.user._id,
    { location: data },
    {
      new: true,
      runValidators: true,
    },
  );
  return res.status(OK).json(utils.makeResponseJson('', null, OK));
});
const getBlockUsers = asyncHandler(async (req: Request, res: Response) => {
  const { blocks } = await UserSchema.findById(req.user._id)
    .select('blocks')
    .populate('blocks', 'fullName avatars uuid userName');

  return res.status(OK).json(utils.makeResponseJson('', blocks, OK));
});
const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.user;
  const { genres } = await UserSchema.findById(_id);
  await GenreSchema.updateMany(
    {
      _id: { $in: genres },
    },
    {
      $pull: { registeredUsers: _id },
    },
    {
      new: true,
    },
  );
  const conversations = await ConversationSchema.find({
    members: {
      $all: [_id],
    },
  }).populate([
    {
      path: 'members',
      select: 'uuid',
    },
  ]);
  conversations.map((conversation) => {
    conversation.members = conversation.members.filter(
      (member) => member._id.toString() !== _id.toString(),
    );
  });
  conversations.map(async (item) => {
    const receiverId = item.members.find((member) => member._id)._id;
    const receiver = await UserSchema.findById(receiverId);
    const conversation = await ConversationSchema.findById(item._id);
    await conversation.deleteOne();
    io.to(receiver.uuid).emit('endConversation', item.uuid);
  });
  await DiscoverySchema.deleteMany({
    $or: [
      {
        sender: _id,
      },
      {
        receiver: _id,
      },
    ],
  });
  await UserSchema.findByIdAndDelete(_id);

  return res
    .status(NO_CONTENT)
    .json(utils.makeResponseJson('', undefined, NO_CONTENT));
});

export {
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  changePrimaryAvatar,
  avatarSequenceChange,
  addGenre,
  deleteGenre,
  addFav,
  removeFav,
  searchUser,
  blockUser,
  unBlockUser,
  Notification,
  discoverySettings,
  Favorites,
  isLoggedIn,
  Compare,
  matchPercent,
  setLocation,
  getBlockUsers,
  deleteAccount,
  updateInfo,
};
