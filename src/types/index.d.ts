import knex from 'knex';

import { Router } from 'express';

import { AccountService } from '../container/services/account';

import { TransactionModel } from '../container/models/transaction';
import { AccountModel } from '../container/models/account';
import { PersonModel } from '../container/models/person';

export interface AppConfig {
  readonly httpPort: number;
  readonly dbConnector: string;
}

interface Env {
  readonly httpPort: number;
  readonly dbConnector: string;
  readonly dbPort: number;
  readonly dbHost: string;
  readonly dbUsername?: string;
  readonly dbPassword?: string;
  readonly dbDatabase?: string;
  readonly dbPoolMin: number;
  readonly dbPoolMax: number;
  readonly dbDebug: boolean;
}

export interface HttpServerConfig {
  port: number;
}

export interface IController {
  register(router: Router): void;
}

export interface IContainer {
  readonly accountService: AccountService;
}

export type ServiceContext = {
  transactionModel: TransactionModel;
  accountModel: AccountModel;
  personModel: PersonModel;
};

export type ContainerConfig = {
  pgDatabase: knex;
};
