import { NOT_FOUND } from 'http-status';
import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';

import { UserSchema } from '@schemas/index';
import { asyncHandler, customError } from '@scripts/index';

const userExits = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserSchema.findById(req.user._id);
    if (!user) {
      req.headers.authorization = null;
      req.user = null;
      return next(new customError('errors.notFoundUser', NOT_FOUND));
    }
    next();
  },
);
const ageCheck = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req?.body?.info?.birthday ?? req?.body?.birthday;
    const today = dayjs();
    const birth = dayjs(data);
    const age = today.diff(birth, 'year');
    console.log('data', data);
    console.log('age', age);
    if (data  && age < 18)
      return next(new customError('errors.underage', 400));
    if (data && age > 100)
      return next(new customError('errors.overage', 400));

    next();
    // const age = Math.abs(
    //   new Date(data).getFullYear() - new Date().getFullYear(),
    // );
    // console.log('age', age);
  },
);

export default { userExits, ageCheck };
