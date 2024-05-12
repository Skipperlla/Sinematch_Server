import express from 'express';
import Series from './series';
import Season from './season';
import Episode from './episode';

const app = express();

app.use('/', Series);
app.use('/:tvId/season/:seasonNumber', Season);
app.use('/:tvId/season/:seasonNumber/episode/:episodeNumber', Episode);

export default app;
