import express from 'express';
import { createServer } from 'http';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import hpp from 'hpp';
import morgan from 'morgan';

import { loaders } from '@loaders/index';
import index from '@routers/api/v1/index';
import { errorHandler } from '@middleware/index';
import { Config } from '@config/index';

import config from '@config/config';

export const app = express();
export const server = createServer(app);

const port = Config.serverConfig.port;
// * Loaders
loaders();
// * Monitoring
// App Setup
// * Initialize Middlewares
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// * Security
app.use(mongoSanitize());
app.use(helmet());

app.use(
  hpp({
    // * Set the following options to true to protect against HTTP Parameter Pollution attacks
    // * https://expressjs.com/en/guide/security.html#http-parameter-pollution-protection
  }),
);
app.use(cors(config.cors));
app.use(morgan('dev'));
app.set('trust proxy', 1);
app.disable('x-powered-by');

//* Routes
app.use('/api/v1', index);

//* Middlewares
app.use(errorHandler);

// * Socket.io

// * Starting Our Server
server.listen(port, () => {
  console.log('Server is running => ' + port);
});
