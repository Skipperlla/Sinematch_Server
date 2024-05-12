import { Request, Response, NextFunction } from 'express';
import { OK, BAD_REQUEST, NOT_FOUND, CREATED, NO_CONTENT } from 'http-status';
import _ from 'lodash';

import { EStatus } from '@schemas/discovery';
import { UserSchema, DiscoverySchema } from '@schemas/index';
import { asyncHandler, customError, utils } from '@scripts/index';
import {
  EGenders,
  EGendersPreferences,
  EMatchTypes,
  EPlans,
  IUser,
} from 'type/schema/user';

const Like = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { receiverId } = req.params;
    const { _id } = req.user;
    const receiver = await UserSchema.findOne({ uuid: receiverId }).select(
      'uuid avatars fcmToken fullName',
    );
    if (!receiver) return next(new customError('', NOT_FOUND));
    const sender = await UserSchema.findById(_id);

    const receiverCheck = await DiscoverySchema.findOne({
      sender: receiver._id,
      receiver: _id,
    });
    const senderCheck = await DiscoverySchema.findOne({
      sender: _id,
      receiver: receiver._id,
    });

    if (receiverCheck) {
      // TODO Beğenilen kullanıcıya push notification gönderilecek => Eşleşmeni kabul etti hemen mesajlaş

      const discovery = await DiscoverySchema.findOneAndUpdate(
        { sender: receiver._id, receiver: _id },
        {
          receiverStatus: EStatus.LIKE,
          status:
            receiverCheck?.senderStatus === EStatus.REJECT
              ? EStatus.NOT_MATCHED
              : receiverCheck?.senderStatus === EStatus.UNDO
              ? EStatus.WAITING
              : EStatus.MATCHED,
        },
        { new: true, runValidators: true },
      ).populate('sender', 'uuid avatars fcmToken fullName');
      //* If the user has an active subscription, the number of matches will not be reduced.
      const d1 = new Date(),
        d2 = new Date(d1);

      const { matchResetCountdown } = await UserSchema.findByIdAndUpdate(
        _id,
        {
          $inc: {
            matchLikeCount: EPlans.NONE === sender?.plan ? -1 : 0,
          },
          matchResetCountdown:
            EPlans.NONE === sender.plan && !(sender?.matchLikeCount - 1)
              ? new Date(d2.setHours(d1.getHours() + 12))
              : undefined,
        },
        { new: true, runValidators: true },
      );

      return res.status(OK).json(
        utils.makeResponseJson(
          '',
          {
            discoveryId: discovery?.uuid,
            user: discovery?.sender,
            status: discovery?.status,
            matchResetCountdown,
            senderStatus: discovery?.senderStatus,
            receiverStatus: discovery?.receiverStatus,
          },
          OK,
        ),
      );
    } else if (senderCheck) {
      const discovery = await DiscoverySchema.findOneAndUpdate(
        { sender: _id, receiver: receiver._id },
        {
          senderStatus: EStatus.LIKE,
          status:
            senderCheck?.receiverStatus === EStatus.REJECT
              ? EStatus.NOT_MATCHED
              : senderCheck?.receiverStatus === EStatus.UNDO
              ? EStatus.WAITING
              : senderCheck?.receiverStatus === EStatus.LIKE
              ? EStatus.MATCHED
              : EStatus.WAITING,
        },
        { new: true, runValidators: true },
      ).populate('receiver', 'uuid avatars fcmToken fullName');
      return res.status(OK).json(
        utils.makeResponseJson(
          '',
          {
            discoveryId: discovery?.uuid,
            user: discovery?.receiver,
            status: discovery?.status,
            senderStatus: discovery?.senderStatus,
            receiverStatus: discovery?.receiverStatus,
          },
          OK,
        ),
      );
    }
    // TODO Beğenilen kullanıcıya push notification gönderilecek

    const discovery = await DiscoverySchema.create({
      sender: _id,
      receiver: receiver._id,
      senderStatus: EStatus.LIKE,
    });
    const { matchResetCountdown } = await UserSchema.findById(_id);

    return res.status(CREATED).json(
      utils.makeResponseJson(
        '',
        {
          discoveryId: discovery.uuid,
          status: discovery.status,
          user: receiver,
          matchResetCountdown,
          senderStatus: discovery?.senderStatus,
          receiverStatus: discovery?.receiverStatus,
        },
        CREATED,
      ),
    );
  },
);
const Reject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { receiverId } = req.params;
    const { _id } = req.user;
    const receiver = await UserSchema.findOne({ uuid: receiverId });
    if (!receiver) return next(new customError('', NOT_FOUND));

    const receiverCheck = await DiscoverySchema.findOne({
      sender: receiver._id,
      receiver: _id,
    });
    const senderCheck = await DiscoverySchema.findOne({
      sender: _id,
      receiver: receiver._id,
    });
    if (receiverCheck) {
      const discovery = await DiscoverySchema.findOneAndUpdate(
        { sender: receiver._id, receiver: _id },
        {
          receiverStatus: EStatus.REJECT,
          status: EStatus.NOT_MATCHED,
        },
        { new: true, runValidators: true },
      )
        .select('status sender uuid')
        .populate('sender', 'uuid avatars');

      return res.status(OK).json(
        utils.makeResponseJson(
          '',
          {
            discoveryId: discovery?.uuid,
            user: discovery?.sender,
            status: discovery?.status,
          },
          OK,
        ),
      );
    } else if (senderCheck) {
      const discovery = await DiscoverySchema.findOneAndUpdate(
        { sender: _id, receiver: receiver._id },
        {
          senderStatus: EStatus.REJECT,
          status: senderCheck?.receiverStatus
            ? EStatus.NOT_MATCHED
            : EStatus.WAITING,
        },
        { new: true, runValidators: true },
      )
        .select('status receiver uuid')
        .populate('receiver', 'uuid avatars');

      return res.status(OK).json(
        utils.makeResponseJson(
          '',
          {
            discoveryId: discovery?.uuid,
            user: discovery?.receiver,
            status: discovery?.status,
          },
          OK,
        ),
      );
    }

    const discovery = await DiscoverySchema.create({
      sender: _id,
      receiver: receiver._id,
      senderStatus: EStatus.REJECT,
    });

    return res.status(CREATED).json(
      utils.makeResponseJson(
        '',
        {
          discoveryId: discovery?.uuid,
          user: discovery?.receiver,
          status: discovery?.status,
        },
        CREATED,
      ),
    );
  },
);

const Undo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { receiverId } = req.params;
    const { _id } = req.user;
    const receiver = await UserSchema.findOne({ uuid: receiverId });
    if (!receiver) return next(new customError('', NOT_FOUND));

    const receiverCheck = await DiscoverySchema.findOne({
      sender: receiver._id,
      receiver: _id,
    });
    const senderCheck = await DiscoverySchema.findOne({
      sender: _id,
      receiver: receiver._id,
    });
    if (receiverCheck) {
      const discovery = await DiscoverySchema.findOneAndUpdate(
        { sender: receiver._id, receiver: _id },
        {
          receiverStatus: EStatus.UNDO,
          status:
            receiverCheck?.senderStatus === EStatus.REJECT
              ? EStatus.NOT_MATCHED
              : EStatus.WAITING,
        },
        { new: true, runValidators: true },
      )
        .select('status sender uuid')
        .populate('sender', 'uuid avatars fullName info');
      return res.status(OK).json(
        utils.makeResponseJson(
          '',
          {
            discoveryId: discovery?.uuid,
            user: discovery?.sender,
            status: discovery?.status,
          },
          OK,
        ),
      );
    } else if (senderCheck) {
      const discovery = await DiscoverySchema.findOneAndUpdate(
        { sender: _id, receiver: receiver._id },
        {
          senderStatus: EStatus.UNDO,
          status:
            senderCheck?.receiverStatus === EStatus.REJECT
              ? EStatus.NOT_MATCHED
              : EStatus.WAITING,
        },
        { new: true, runValidators: true },
      )
        .select('status receiver uuid')
        .populate('receiver', 'uuid avatars fullName info');

      return res.status(OK).json(
        utils.makeResponseJson(
          '',
          {
            discoveryId: discovery?.uuid,
            user: discovery?.receiver,
            status: discovery?.status,
          },
          OK,
        ),
      );
    }
  },
);

const Discoveries = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.user;

  const { favMovies, favSeries, genres, blocks, discoverySettings } =
    await UserSchema.findById(_id).select(
      'favMovies favSeries genres blocks discoverySettings location',
    );
  const whoBlockedMe = (
    await UserSchema.find({
      blocks: {
        $in: _id,
      },
    })
  ).map((item) => item._id);
  const sender = (
    await DiscoverySchema.find({
      $or: [
        {
          sender: _id,
          senderStatus: {
            $in: [EStatus.LIKE, EStatus.REJECT],
          },
        },
        {
          receiver: _id,
          receiverStatus: {
            $in: [EStatus.LIKE, EStatus.REJECT],
          },
        },
      ],
      status: {
        $in: [EStatus.MATCHED, EStatus.NOT_MATCHED, EStatus.WAITING],
      },
    }).sort({ receiverStatus: -1, senderStatus: -1 })
  )?.reduce((acc, item) => {
    acc.push(item.receiver);
    acc.push(item.sender);
    return acc;
  }, []);
  const clearDuplicate = _.uniqBy(sender, function (e) {
    return e.toString();
  });

  //? Type =>1 Just Movies with will be matched
  //? Type =>2 Sadece favori dizi eşleşenleri alır
  //? Type =>1 Her ikisinde alır
  const matchType =
    discoverySettings?.matchType === EMatchTypes.MOVIE
      ? {
          'favMovies.id': {
            $in: favMovies?.map((movie) => {
              return movie.id;
            }),
          },
        }
      : discoverySettings?.matchType === EMatchTypes.SERIES
      ? {
          'favSeries.id': {
            $in: favSeries?.map((series) => {
              return series.id;
            }),
          },
        }
      : {
          $or: [
            {
              'favMovies.id': {
                $in: favMovies?.map((movie) => {
                  return movie.id;
                }),
              },
            },
            {
              'favSeries.id': {
                $in: favSeries?.map((series) => {
                  return series.id;
                }),
              },
            },
          ],
        };
  const discoveries = await UserSchema.find({
    _id: { $ne: _id, $nin: [...clearDuplicate, ...blocks, ...whoBlockedMe] },
    'info.birthday': {
      $gte: discoverySettings.ageRange.min, // Min
      $lte: discoverySettings.ageRange.max, // Max
    },
    'info.gender': {
      $in:
        discoverySettings?.genderPreference === EGendersPreferences.BOTH
          ? [EGenders.MALE, EGenders.FEMALE, EGenders.UNSPECIFIED]
          : discoverySettings?.genderPreference,
    },
    isCompletedProfile: true,
    $or: [{ genres: { $in: genres } }, matchType],
    // location: {
    //   $near: {
    //     $geometry: location,
    //     $minDistance: 0, // more than or equal to 500 km away
    //     $maxDistance: discoverySettings.locationDistance, // less than or equal to 700 km away
    //   },
    // },
  })
    .select('fullName info avatars uuid location plan')
    .sort({ plan: -1, createdAt: -1 });

  // const geocodeUsers = discoveries?.map((discovery, index) => {
  //   const distanceMatrix = googleMapsApi.haversine(
  //     location?.coordinates?.[1],
  //     location?.coordinates?.[0],
  //     discovery?.location?.coordinates?.[1],
  //     discovery?.location?.coordinates?.[0],
  //   );

  //   return {
  //     discovery: discoveries[index],
  //     distanceMatrix,
  //   };
  // });

  return res.status(OK).json(utils.makeResponseJson('', discoveries, OK));
});

const Ignored = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.user;
  const limit = Number(req.query.limit) || 20;
  // const { location } = await UserSchema.findById(_id).select('location');

  const discoveries = (
    await DiscoverySchema.find({
      $or: [
        { senderStatus: EStatus.REJECT, sender: _id },
        {
          receiverStatus: EStatus.REJECT,
          receiver: _id,
        },
      ],
    })
      .select('sender receiver uuid')
      .populate('sender receiver', 'fullName uuid avatars info')
      .limit(limit)
      .sort({ updatedAt: -1 })
  ).map((discovery) => {
    const sender = discovery.sender as IUser;
    const receiver = discovery.receiver as IUser;

    if (sender._id.toString() === String(_id))
      return {
        user: receiver,
        uuid: discovery.uuid,
      };
    else
      return {
        user: sender,
        uuid: discovery.uuid,
      };
  });
  // .reverse();
  // const geocodeUsers = discoveries.map((discovery, index) => {
  //   const haversine = googleMapsApi.haversine(
  //     location?.coordinates?.[1],
  //     location?.coordinates?.[0],
  //     discovery?.user?.location?.coordinates?.[1],
  //     discovery?.user?.location?.coordinates?.[0],
  //   );

  //   return {
  //     discovery: discoveries[index],
  //     distanceMatrix: haversine,
  //   };
  // });
  const count = await DiscoverySchema.countDocuments({
    $or: [
      { senderStatus: EStatus.REJECT, sender: _id },
      {
        receiverStatus: EStatus.REJECT,
        receiver: _id,
      },
    ],
  });
  return res
    .status(OK)
    .json(utils.makeResponseJson('', { discoveries, count }, OK));
});
const Likes = asyncHandler(async (req: Request, res: Response) => {
  // const sender = await UserSchema.findById(req.user._id).select('location');
  const limit = Number(req.query.limit) || 20;
  const { _id } = req.user;

  const discoveries = await DiscoverySchema.find({
    receiver: _id,
    senderStatus: [EStatus.LIKE],
    status: EStatus.WAITING,
  })
    .select('sender uuid')
    .populate('sender', 'fullName uuid avatars location info')
    .sort({ plan: -1, createdAt: -1 })
    .limit(limit);

  // const geocodeUsers = discoveries.map((discovery, index) => {
  //   const haversine = googleMapsApi.haversine(
  //     sender?.location?.coordinates?.[1],
  //     sender?.location?.coordinates?.[0],
  //     discovery?.sender?.location?.coordinates?.[1],
  //     discovery?.sender?.location?.coordinates?.[0],
  //   );

  //   return {
  //     discovery: discoveries[index],
  //     distanceMatrix: haversine,
  //   };
  // });

  const count = await DiscoverySchema.countDocuments({
    receiver: _id,
    senderStatus: [EStatus.LIKE],
    status: EStatus.WAITING,
  });

  return res
    .status(OK)
    .json(utils.makeResponseJson('', { discoveries, count }, OK));
});

const deleteDiscovery = asyncHandler(async (req: Request, res: Response) => {
  const { discoveryId, receiverId } = req.params;
  const { _id } = req.user;
  const receiver = await UserSchema.findOne({
    uuid: receiverId,
  });
  await DiscoverySchema.findOneAndDelete({
    $or: [
      { uuid: discoveryId },
      {
        sender: receiver._id,
        receiver: _id,
      },
      {
        sender: _id,
        receiver: receiver._id,
      },
    ],
  });
  return res
    .status(NO_CONTENT)
    .json(utils.makeResponseJson('', null, NO_CONTENT));
});

export { Like, Reject, Undo, Discoveries, Ignored, Likes, deleteDiscovery };
