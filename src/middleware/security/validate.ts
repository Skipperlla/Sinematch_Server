import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status';
import { ObjectSchema } from 'joi';

import { errorResponseJSON } from '../errorHandler';

const validate =
  (schema: ObjectSchema<string>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { value, error } = schema.validate(req.body);

    if (error) {
      const errorMessage = error.details
        ?.map((detail: { message: string }) => detail.message)
        .join(', ');
      res.status(BAD_REQUEST).json(
        errorResponseJSON({
          statusCode: BAD_REQUEST,
          title: 'errors.400.title',
          type: 'errors.400.type',
          message: errorMessage,
        }),
      );

      return;
    }
    Object.assign(req, value);
    return next();
  };

export default validate;
