import axios from 'axios';

import { Config } from '@config/index';

const mediaAPI = axios.create({
  baseURL:
    Config.serverConfig.env === 'production'
      ? 
        '/api/v1/media'
      : 'http://localhost:8080/api/v1/Media',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default mediaAPI;
