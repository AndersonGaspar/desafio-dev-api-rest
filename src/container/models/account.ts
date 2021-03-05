import knex from 'knex';
import { Account, IAccountModel, CreateAccount } from '../../types/Account';

export class AccountModel implements IAccountModel {
  protected readonly database: knex;

  constructor (database: knex) {
    this.database = database;
  }

  async findByPersonId(personId: number): Promise<Account> {
    return this.database('conta').where('idPessoa', personId).first();
  }

  async findById(accountId: number): Promise<Account> {
    return this.database('conta').where('idConta', accountId).first();
  }

  async update(accountId: number, data: object): Promise<Account> {
    return this.database('conta').where('idConta', accountId).update(data);
  }

  async create(account: CreateAccount): Promise<Account> {
    return this.database('conta').insert(account).returning('idPessoa');
  }

}
