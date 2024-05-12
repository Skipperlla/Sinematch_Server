import { NextFunction, Request, Response } from 'express';
import { NOT_FOUND } from 'http-status';

import { DiscoverySchema, UserSchema } from '@schemas/index';
import { asyncHandler, customError } from '@scripts/index';

const discoveryExits = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user;
    const { discoveryId, receiverId } = req.params;
    const receiver = await UserSchema.findOne({
      uuid: receiverId,
    });
    const discovery = await DiscoverySchema.findOne({
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

    if (!discovery)
      return next(
        new customError('controllers.user.discovery.noMatch', NOT_FOUND),
      );

    next();
  },
);

export default { discoveryExits };
