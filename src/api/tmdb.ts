import axios from 'axios';

import { Config } from '@config/index';

const tmdbAPI = axios.create({
  baseURL: 'https://api.themoviedb.org/3',

  headers: {
    'Access-Control-Allow-Origin': '*',
    Authorization: `Bearer ${Config.movieDBApiKey}`,
    'Content-Type': 'application/json',
  },
});

export default tmdbAPI;
