import knex from 'knex';

import knexfile = require('../../knexfile');

let database: knex;

export default function databaseInstance(): knex {
  if (!database) {
    database = knex(knexfile);
  }
  return database;
}
