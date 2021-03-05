import knex from 'knex';
import { Transaction, ITransactionModel, InsertTransaction } from '../../types/Transaction';

export class TransactionModel implements ITransactionModel {
  protected readonly database: knex;

  constructor (database: knex) {
    this.database = database;
  }

  async insert(transaction: InsertTransaction): Promise<Transaction> {
    return this.database('transacao').insert(transaction);
  }

  async listByAccountId(accountId: number): Promise<Transaction[]> {
    return this.database('transacao')
      .where('idConta', accountId)
      .orderBy('dataTransacao', 'desc');
  }

  async listByAccountIdBetweenDates(accountId: number, initialDate: string, finalDate: string): Promise<Transaction[]> {
    return this.database('transacao')
      .where('idConta', accountId)
      .whereBetween('dataTransacao', [initialDate, finalDate])
      .orderBy('dataTransacao', 'desc');
  }

}
