import { NextFunction, Request, Response } from 'express';
import { NOT_FOUND } from 'http-status';

import { ConversationSchema, UserSchema } from '@schemas/index';
import { asyncHandler, customError } from '@scripts/index';

const receiverExits = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const receiver = await UserSchema.findOne({ uuid: req.params.receiverId });

    if (!receiver)
      return next(new customError('errors.notFoundUser', NOT_FOUND));

    next();
  },
);
const conversationExits = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { conversationId } = req.params;

    const conversation = await ConversationSchema.findOne({
      uuid: conversationId,
      members: {
        $all: [req.user._id],
      },
    });
    if (!conversation)
      return next(new customError('errors.conversationNotFound', NOT_FOUND));

    next();
  },
);
export default { receiverExits, conversationExits };
