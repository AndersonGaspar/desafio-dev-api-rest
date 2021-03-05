import { HttpServer } from './http';
import { Container } from './container';
import databaseInstance from './helpers/database';

import { AppConfig } from './types';

export class Application {
  private readonly config: AppConfig;

  constructor (config: AppConfig) {
    this.config = config;
  }

  async start(): Promise<void> {
    const {
      httpPort,
    } = this.config;

    const container = new Container({
      pgDatabase: databaseInstance(),
    });

    const httpServer = new HttpServer(
      container,
      {
        port: httpPort,
      },
    );

    httpServer.start();
    console.log(`Http server started in port ${httpPort}`);
  }
}
