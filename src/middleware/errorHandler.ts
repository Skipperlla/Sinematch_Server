import { NextFunction, Request, Response } from 'express';
import {
  NOT_FOUND,
  UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  CONFLICT,
  UNAUTHORIZED,
  FORBIDDEN,
  GONE,
} from 'http-status';
import i18next from 'i18next';
import moment from 'moment';

type IErrorResponseJSONProps = {
  statusCode: number;
  success?: boolean;
  title?: string;
  type?: string;
  message?: string;
  errors?: unknown[];
  data?: object | Array<object | []>;
  error?: {
    type: string;
    title: string;
    message: string;
    errors: unknown[];
  };
  timestamp?: string;
};

export const errorResponseJSON = ({
  statusCode,
  data,
  title,
  type,
  message,
  errors = [],
}: IErrorResponseJSONProps): IErrorResponseJSONProps => ({
  statusCode: statusCode,
  success: false,
  data: data || null,
  error: {
    type: i18next.t(type),
    title: i18next.t(title),
    message: i18next.t(message),
    errors,
  },
  timestamp: moment().format('LLLL'),
});
type ErrorProps = {
  statusCode: number;
  message: string;
  name: string;
  keyValue: string;
  code: number | string;
  errors: unknown[];
};
const errorMiddleware = (
  err: ErrorProps,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): Response<IErrorResponseJSONProps> => {
  const { statusCode = INTERNAL_SERVER_ERROR } = err;
  console.log('new Error', err);
  if (err.code === 11000) {
    // Mongo error
    const field = Object.keys(err.keyValue);

    if (field[0] === 'email' || field[0] === 'userName')
      return res.status(CONFLICT).json(
        errorResponseJSON({
          statusCode: CONFLICT,
          title: 'errors.409.title',
          type: 'errors.409.type',
          message:
            field[0] === 'email'
              ? 'errors.duplicateEmail'
              : 'errors.duplicateUserName',
        }),
      );
    else
      return res.status(CONFLICT).json(
        errorResponseJSON({
          statusCode: CONFLICT,
          title: 'errors.409.title',
          type: 'errors.409.type',
          message: 'errors.409.message',
        }),
      );
  }

  //   if (err?.errors?.userName?.path === 'userName')
  //     return res.status(BAD_REQUEST).json(
  //       errorResponseJSON({
  //         statusCode: BAD_REQUEST,
  //         title: 'errors.400.title',
  //         type: 'errors.400.type',
  //         message: err?.errors?.userName?.message || 'errors.404.message',
  //       }),
  //     );

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(
      (el: { message: string; path: string }) => ({
        message: el.message,
        path: el.path,
      }),
    );

    return res.status(BAD_REQUEST).json(
      errorResponseJSON({
        statusCode: BAD_REQUEST,
        title: 'errors.400.title',
        type: 'errors.400.type',
        message: err?.message || 'errors.400.message',
        errors,
      }),
    );
  }

  if (err.statusCode === BAD_REQUEST || err.code === 'LIMIT_UNEXPECTED_FILE') {
    // * BadRequestError
    return res.status(BAD_REQUEST).json(
      errorResponseJSON({
        statusCode: BAD_REQUEST,
        title: 'errors.400.title',
        type: 'errors.400.type',
        message: err?.message || 'errors.400.message',
      }),
    );
  }

  if (err.statusCode === UNAUTHORIZED) {
    // UnathorizeError
    return res.status(UNAUTHORIZED).json(
      errorResponseJSON({
        statusCode: UNAUTHORIZED,
        title: 'errors.401.title',
        type: 'errors.401.type',
        message: err?.message || 'errors.401.message',
      }),
    );
  }

  if (err.statusCode === CONFLICT) {
    // CONFLICT
    return res.status(CONFLICT).json(
      errorResponseJSON({
        statusCode: CONFLICT,
        title: 'errors.409.title',
        type: 'errors.409.type',
        message: err?.message || 'errors.409.message',
      }),
    );
  }
  if (err.statusCode === GONE) {
    // GONE
    return res.status(GONE).json(
      errorResponseJSON({
        statusCode: GONE,
        title: 'errors.410.title',
        type: 'errors.410.type',
        message: err?.message || 'errors.410.message',
      }),
    );
  }

  if (err.statusCode === FORBIDDEN) {
    // Forbidden
    return res.status(FORBIDDEN).json(
      errorResponseJSON({
        statusCode: FORBIDDEN,
        title: 'errors.403.title',
        type: 'errors.403.type',
        message: err?.message || 'errors.403.message',
      }),
    );
  }

  if (err.statusCode === NOT_FOUND) {
    // NotFoundError
    return res.status(NOT_FOUND).json(
      errorResponseJSON({
        statusCode: NOT_FOUND,
        title: 'errors.404.title',
        type: 'errors.404.type',
        message: err?.message || 'errors.404.message',
      }),
    );
  }

  if (err.statusCode === UNPROCESSABLE_ENTITY) {
    return res.status(UNPROCESSABLE_ENTITY).json(
      errorResponseJSON({
        statusCode: UNPROCESSABLE_ENTITY,
        title: 'errors.422.title',
        type: 'errors.422.type',
        message: err?.message || 'errors.422.message',
      }),
    );
  }

  console.log('FROM MIDDLEWARE ------------------------', err);
  res.status(statusCode).json(
    errorResponseJSON({
      statusCode,
      title: 'errors.500.title',
      type: 'errors.500.type',

      message: err?.message || 'errors.500.message',
    }),
  );
};

export default errorMiddleware;
