import express from 'express';
import Movie from './movie';
import Series from './series';
import Search from './search';

const app = express();

app.use('/movie', Movie);
app.use('/series', Series);
app.use('/search', Search);

export default app;
