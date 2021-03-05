import express from 'express';
import bodyParser from 'body-parser';

import { Container } from '../container';
import { AccountController } from './controllers/v1/account';
import { HttpServerConfig } from '../types';

export class HttpServer {
  private readonly container: Container;
  private readonly config: HttpServerConfig;

  constructor (container: Container, config: HttpServerConfig) {
    this.container = container;
    this.config = config;
  }

  start(): void {

    const app = express();
    app.use(bodyParser.json());
    const controller = new AccountController(this.container);

    const router = express.Router();
    controller.register(router);
    app.use(router);

    app.listen(this.config.port);
  }
}
