import { env } from './src/env';

module.exports = {
  client: 'postgresql',
  debug: false,
  connection: {
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUsername,
    password: env.dbPassword,
    database: env.dbDatabase,
    supportBigNumbers: true,
    bigNumberStrings: true,
    multipleStatements: true,
    dateStrings: true,
  },
  pool: {
    min: env.dbPoolMin,
    max: env.dbPoolMax,
  },
  migrations: {
    tableName: 'migrations',
  },
};
