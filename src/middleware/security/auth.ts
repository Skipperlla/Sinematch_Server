import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { FORBIDDEN, UNAUTHORIZED, OK, GONE } from 'http-status';

import { Config } from '@config/index';
import { customError, utils } from '@scripts/index';
import { IUser, UserProps } from 'type/schema/user';

const accessToRoute = (
  req: Request,
  res: Response,
  next: NextFunction,
): string | void => {
  if (!IsTokenIncluded(req))
    return next(new customError('errors.403.message', FORBIDDEN));

  const token = getAccessTokenFromHeader(req);
  jwt.verify(token, Config.jwt.Secret, (err, decodeToken: IUser) => {
    if (err?.name === 'TokenExpiredError') {
      return next(new customError('errors.410.message', GONE));
    } else if (err) {
      return next(new customError('errors.401.message', UNAUTHORIZED));
    }
    const { _id, fullName, userName, email, uuid } = decodeToken;
    req.user = {
      _id,
      fullName,
      userName,
      email,
      uuid,
    };
    next();
  });
};
const sendTokenClient = (
  user: UserProps,
  req: Request,
  res: Response,
  statusCode: number = OK,
): Response => {
  const accessToken = user.generateJWTToken();
  req.headers.authorization = `Bearer ${accessToken}`;
  return res.status(statusCode).json(
    utils.makeResponseJson(
      '',
      {
        user,
        accessToken,
      },
      statusCode,
    ),
  );
};
const IsTokenIncluded = (req: Request): boolean => {
  return (
    req.headers.authorization && req.headers.authorization.startsWith('Bearer')
  );
};

const getAccessTokenFromHeader = (req: Request): string => {
  const authorization = req?.headers?.authorization;
  const accessToken = authorization?.split(' ')[1];
  return accessToken;
};

const decodeToken = (req: Request): string | JwtPayload => {
  const accessToken = getAccessTokenFromHeader(req);
  const decodeToken = jwt.decode(accessToken);
  return decodeToken;
};

export default {
  decodeToken,
  accessToRoute,
  sendTokenClient,
  IsTokenIncluded,
  getAccessTokenFromHeader,
};
