import { CREATED, NOT_FOUND, NO_CONTENT, OK } from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { v4 } from 'uuid';
import moment from 'moment';

import { UserSchema } from '@schemas/index';
import { asyncHandler, customError, utils } from '@scripts/index';
import { security } from '@middleware/index';

const Register = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserSchema.findByIdAndUpdate(
    req.user._id,
    {
      $set: req.body,
    },
    {
      new: true,
    },
  ).select('userName info fullName email discoverySettings uuid');

  return res.status(OK).json(utils.makeResponseJson('', user, OK));
});

const Logout = asyncHandler(async (req: Request, res: Response) => {
  await UserSchema.findByIdAndUpdate(
    req.user._id,
    {
      fcmToken: null,
    },
    {
      new: true,
    },
  );

  req.headers.authorization = null;
  req.user = null;
  return res
    .status(NO_CONTENT)
    .json(utils.makeResponseJson('', null, NO_CONTENT));
});

const loginWithProvider = asyncHandler(async (req: Request, res: Response) => {
  const { provider, providerId, email, fullName, uuid } = req.body;

  const user = await UserSchema.findOne({
    $or: [{ providerId }, { email }, { uuid }],
  }).select(
    'fullName userName discoverySettings email info avatars favMovies favSeries genres isCompletedProfile notifications matchResetCountdown plan uuid matchLikeCount',
  );
  if (!user) {
    const newUser = await UserSchema.create({
      uuid: v4(),
      provider,
      providerId,
      email,
      fullName,
    });
    security.sendTokenClient(newUser, req, res, CREATED);
  } else if (!user.isCompletedProfile) {
    user.fullName = fullName ?? user.fullName;
    user.email = email ?? user.email;
    await user.save();
    security.sendTokenClient(user, req, res);
  } else {
    await user.save();
    security.sendTokenClient(user, req, res);
  }
});

export { Register, Logout, loginWithProvider };
