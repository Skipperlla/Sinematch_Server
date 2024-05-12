import Mongoose from 'mongoose';

import { Config } from '@config/index';

const dbName =
  process.env.NODE_ENV === 'development' ? 'movieApp' : 'Sinematch';
const mongoUri =
  process.env.NODE_ENV === 'development'
    ? Config.mongoDB.devUrl
    : Config.mongoDB.prodUrl;

Mongoose.set('strictQuery', false);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // serverSelectionTimeoutMS: 5000,
  dbName,
};

export default async function (): Promise<void> {
  try {
    await Mongoose.connect(mongoUri, options);
    console.log('Connected to mongoose');
  } catch (e) {
    console.log('Error connecting to mongoose: ', e);
  }
}
