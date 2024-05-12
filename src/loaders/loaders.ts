import { Request, Response, NextFunction } from 'express';
import { app } from 'src/main';

import moment from 'moment';
import admin from 'firebase-admin';

import db from './db';
import i18n, { i18next, i18nextMiddleware } from './i18n';
import socket from './socket';
import serviceAccount from '../sinematch-firebase-adminsdk-30su1-5277bee7be.json';

export default function (): void {
  db();
  i18n();
  socket();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });

  //* Initialize i18next middleware for express
  app.use(i18nextMiddleware.handle(i18next));
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const language = req.headers['accept-language'];
    i18next.changeLanguage(language);
    //* Set language for moment
    moment.locale(language);
    next();
  });
}
