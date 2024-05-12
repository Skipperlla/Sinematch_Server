import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, GONE, NOT_FOUND, PAYMENT_REQUIRED } from 'http-status';

import { asyncHandler, customError } from '@scripts/index';
import { UserSchema } from '@schemas/index';
import { EPlans } from 'type/schema/user';

const userAvatarLengthCheck = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { avatars } = await UserSchema.findById(req.user._id);
    if (avatars?.length >= 6)
      return next(new customError('errors.maxPhotoUpload', BAD_REQUEST));
    next();
  },
);

const userExits = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.params?.userId ?? req?.body?.userId;

    // TODO: check user exits from req.user._id
    const user = await UserSchema.findOne({
      $or: [{ uuid: userId }],
    });

    if (!user) return next(new customError('errors.notFoundUser', NOT_FOUND));

    next();
  },
);
const userExitsForHeader = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserSchema.findById(req.user._id);
    if (!user) return next(new customError('errors.notFoundUser', NOT_FOUND));
    next();
  },
);

const subscriptionCheck = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserSchema.findById(req?.user?._id);
    if (user.plan === EPlans.NONE)
      return next(new customError('', PAYMENT_REQUIRED));
    next();
  },
);
const likeCountCheck = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserSchema.findById(req.user._id);

    if (user.plan === EPlans.NONE) {
      if (Date.now() > new Date(user?.matchResetCountdown).getTime()) {
        user.matchLikeCount = 40;
        user.matchResetCountdown = undefined;
        await user.save();
      }
      if (!user?.matchLikeCount)
        return next(new customError('', PAYMENT_REQUIRED));
    }
    next();
  },
);
export default {
  userAvatarLengthCheck,
  subscriptionCheck,
  likeCountCheck,
  userExits,
  userExitsForHeader,
};
