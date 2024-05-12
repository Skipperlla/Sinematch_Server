import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV;
if (env === 'development') {
  dotenv.config({ path: path.join(__dirname, '../.env.production') });
} else {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

export default {
  serverConfig: {
    env,
    port: process.env.PORT,
  },
  mongoDB: {
    devUrl: process.env.MONGODB_DEV,
    prodUrl: process.env.MONGODB_PRODUCTION,
  },
  cors: {
    origin: '',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  nodeMailer: {
    host: process.env.SMTP_SERVER_HOST,
    port: process.env.SMTP_SERVER_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  },
  jwt: {
    Secret: process.env.JWT_SECRET_KEY,
    expiresIn: Number(process.env.JWT_EXPIRE_IN),
    refreshExpiresIn: Number(process.env.JWT_REFRESH_EXPIRE_IN),
  },
  s3: {
    bucket: process.env.BUCKET_NAME,
    endPoint: process.env.ENDPOINT,
    region: process.env.REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  cryptoJS: {
    secretKey: process.env.SECRET_KEY,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_KEY,
  },
  movieDBApiKey: process.env.MOVIE_DB_API_KEY,
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  replicateApiKey: process.env.REPLICATE_API_TOKEN,
};
