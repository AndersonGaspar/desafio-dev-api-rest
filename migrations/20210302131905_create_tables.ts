import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('pessoa', (table) => {
    table.increments('idPessoa').unique().primary().notNullable();
    table.string('nome', 60).notNullable();
    table.string('cpf', 11).unique().notNullable();
    table.date('dataNascimento').notNullable();
  }).createTable('conta', (table) => {
    table.increments('idConta').unique().primary().notNullable();
    table.integer('idPessoa').references('idPessoa').inTable('pessoa').notNullable();
    table.bigInteger('saldo').notNullable().defaultTo(0);
    table.bigInteger('limiteSaqueDiario').notNullable().defaultTo('100000');
    table.boolean('flagAtivo').notNullable().defaultTo(true);
    table.integer('tipoConta');
    table.timestamp('dataCriacao').notNullable().defaultTo(knex.fn.now());
  }).createTable('transacao', (table) => {
    table.increments('idTransacao').unique().primary().notNullable();
    table.integer('idConta').references('idConta').inTable('conta').notNullable();
    table.bigInteger('valor').notNullable();
    table.timestamp('dataTransacao').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTable('transacao')
    .dropTable('conta')
    .dropTable('pessoa');
}
