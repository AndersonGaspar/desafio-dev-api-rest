import { Application } from './app';
import { env } from './env';

import { AppConfig } from './types';

const appConfig: AppConfig = {
  dbConnector: env.dbConnector,
  httpPort: env.httpPort,
};

const application = new Application(appConfig);

setImmediate(async () => {
  await application.start();
  console.log('Application started');
});
