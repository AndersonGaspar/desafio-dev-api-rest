import * as dotenv from 'dotenv';
import { Env } from './types';

dotenv.config();

export const env: Env = {
  httpPort: (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000,
  dbConnector: process.env.DB_CONNECTOR || 'postgresql',
  dbPort: parseInt(process.env.DB_PORT || '5432', 10),
  dbHost: process.env.DB_HOST || '',
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbDatabase: process.env.DB_DATABASE,
  dbPoolMin: parseInt(process.env.DB_POOL_MIN || '1', 10),
  dbPoolMax: parseInt(process.env.DB_POOL_MAX || '1', 10),
  dbDebug: process.env.DB_DEBUG === 'true',
};
