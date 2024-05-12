import axios from 'axios';

import { Config } from '@config/index';

const replicateAPI = axios.create({
  baseURL: 'https://api.replicate.com/v1/predictions',
  headers: {
    'Access-Control-Allow-Origin': '*',
    Authorization: `Token ${Config.replicateApiKey}`,
    'Content-Type': 'application/json',
  },
});

export default replicateAPI;
