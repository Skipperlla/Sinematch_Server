import { Response } from 'express';
import rateLimit, {
  RateLimitRequestHandler,
  AugmentedRequest,
} from 'express-rate-limit';
import { TOO_MANY_REQUESTS } from 'http-status';
import i18next from 'i18next';

import { errorResponseJSON } from '@middleware/errorHandler';

export default function (
  windowMs: number,
  max: number,
): RateLimitRequestHandler {
  return rateLimit({
    windowMs,
    max,
    message: async (request: AugmentedRequest, response: Response) => {
      return response.status(TOO_MANY_REQUESTS).json(
        errorResponseJSON({
          statusCode: TOO_MANY_REQUESTS,
          title: 'errors.429.title',
          type: 'errors.429.type',
          message: i18next.t('errors.429.message'),
        }),
      );
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}
