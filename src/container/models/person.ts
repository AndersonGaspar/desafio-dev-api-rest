import knex from 'knex';
import { Person, IPersonModel, CreatePerson } from '../../types/Person';

export class PersonModel implements IPersonModel {
  protected readonly database: knex;

  constructor (database: knex) {
    this.database = database;
  }

  async findByDocument(document: string): Promise<Person> {
    return this.database('pessoa').where('cpf', document).first();
  }

  async create(person: CreatePerson): Promise<number> {
    return this.database('pessoa').insert(person).returning('idPessoa');
  }

}
