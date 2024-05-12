import express from 'express';
import Media from './media';
import User from './user';

const app = express();

app.use('/user', User);
app.use('/media', Media);

export default app;
