import { AccountService } from './services/account';

import { TransactionModel } from './models/transaction';
import { AccountModel } from './models/account';
import { PersonModel } from './models/person';

import {
  ContainerConfig,
  ServiceContext,
  IContainer,
} from '../types/';

export class Container implements IContainer {
  readonly accountService: AccountService;

  constructor (config: ContainerConfig) {
    const { pgDatabase } = config;

    const serviceContext: ServiceContext = {
      transactionModel: new TransactionModel(pgDatabase),
      accountModel: new AccountModel(pgDatabase),
      personModel: new PersonModel(pgDatabase),
    };

    this.accountService = new AccountService(serviceContext);
  }
}
