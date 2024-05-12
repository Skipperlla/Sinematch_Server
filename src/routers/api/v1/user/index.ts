import express from 'express';

import { conversationExits, security } from '@middleware/index';

import Auth from './auth';
import User from './user';
import Conversation from './conversation';
import Message from './message';
import Discovery from './discovery';
import Notification from './notification';

const app = express();

app.use('/auth', Auth);
app.use('/', security.accessToRoute, User);
app.use('/conversation', security.accessToRoute, Conversation);
app.use(
  '/message/:conversationId',
  [
    security.accessToRoute,
    // conversationExits.receiverExits,
    conversationExits.conversationExits,
  ],
  Message,
);
app.use('/discovery', security.accessToRoute, Discovery);
app.use('/notification', Notification);

export default app;
