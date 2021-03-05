import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { PersonModel } from '../src/container/models/person' ;
import { AccountModel } from '../src/container/models/account' ;
import { TransactionModel } from '../src/container/models/transaction' ;
import { AccountService } from '../src/container/services/account';
import { AccountController } from '../src/http/controllers/v1/account';
import databaseInstance from '../src/helpers/database';

describe('Integration tests', () => {
  const db = databaseInstance();

  afterAll(() => {
    db.destroy();
  });
  
  describe('#create', () => {
    it('should insert a account and return status 201', async () => {
      const request = new Request();
      const response = new Response();

      const container = {
        accountService: new AccountService({
          personModel: new PersonModel(db),
          accountModel: new AccountModel(db),
          transactionModel: new TransactionModel(db),
        }),
      };

      const accountController = new AccountController(container);

      const requestData = {
        personName: 'luiz',
        personDocument: '12312312311',
        personBirthdate: '1996-02-14',
      };

      request.setBody(requestData);
      // @ts-ignore
      await accountController.create(request, response);

      const [registerPerson] = await db('pessoa').where('cpf', requestData.personDocument);
      const [registerAccount] = await db('conta').where('idPessoa', registerPerson.idPessoa);
      
      expect(registerAccount.idConta).toBeDefined();
      expect(response.statusCode).toEqual(201);

      await db('conta').where('idConta', registerAccount.idConta).del();
      await db('pessoa').where('idPessoa', registerPerson.idPessoa).del();
    });
  });

  describe('#deposit', () => {
    it('should make a deposit and return 200', async () => {
      const request = new Request();
      const response = new Response();

      const container = {
        accountService: new AccountService({
          personModel: new PersonModel(db),
          accountModel: new AccountModel(db),
          transactionModel: new TransactionModel(db),
        }),
      };

      const accountController = new AccountController(container);

      const fakePerson = {
        nome: 'joao',
        cpf: '12341234123',
        dataNascimento: new Date('2000-01-01')
      };

      const [fakePersonId] = await db('pessoa').insert(fakePerson).returning('idPessoa');

      const fakeAccount = {
        saldo: 0,
        limiteSaqueDiario: 1000,
        idPessoa: fakePersonId
      };

      const [fakeAccountId] = await db('conta').insert(fakeAccount).returning('idConta');

      request.setParams({
        id: String(fakeAccountId)
      });
      request.setBody({
        amount: 100
      });
      // @ts-ignore
      await accountController.deposit(request, response);

      const [registerAccount] = await db('conta').where('idConta', fakeAccountId);
      
      expect(registerAccount.saldo).toBeDefined();
      expect(registerAccount.saldo).toEqual("10000");
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        newBalance: '100.00'
      });

      await db('transacao').where('idConta', fakeAccountId).del();
      await db('conta').where('idConta', fakeAccountId).del();
      await db('pessoa').where('idPessoa', fakePersonId).del();
    });
  });

  describe('#withdrawal', () => {
    it('should make a withdrawal and return 200', async () => {
      const request = new Request();
      const response = new Response();

      const container = {
        accountService: new AccountService({
          personModel: new PersonModel(db),
          accountModel: new AccountModel(db),
          transactionModel: new TransactionModel(db),
        }),
      };

      const accountController = new AccountController(container);

      const fakePerson = {
        nome: 'joao',
        cpf: '12341234123',
        dataNascimento: new Date('2000-01-01')
      };

      const [fakePersonId] = await db('pessoa').insert(fakePerson).returning('idPessoa');

      const fakeAccount = {
        saldo: 10000,
        limiteSaqueDiario: 10000,
        idPessoa: fakePersonId
      };

      const [fakeAccountId] = await db('conta').insert(fakeAccount).returning('idConta');

      request.setParams({
        id: String(fakeAccountId)
      });
      request.setBody({
        amount: 100
      });
      // @ts-ignore
      await accountController.withdrawal(request, response);

      const [registerAccount] = await db('conta').where('idConta', fakeAccountId);
      
      expect(registerAccount.saldo).toBeDefined();
      expect(registerAccount.saldo).toEqual("0");
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        newBalance: '0.00'
      });

      await db('transacao').where('idConta', fakeAccountId).del();
      await db('conta').where('idConta', fakeAccountId).del();
      await db('pessoa').where('idPessoa', fakePersonId).del();
    });
  });

  describe('#block', () => {
    it('should block an account and return 204', async () => {
      const request = new Request();
      const response = new Response();

      const container = {
        accountService: new AccountService({
          personModel: new PersonModel(db),
          accountModel: new AccountModel(db),
          transactionModel: new TransactionModel(db),
        }),
      };

      const accountController = new AccountController(container);

      const fakePerson = {
        nome: 'joao',
        cpf: '12341234123',
        dataNascimento: new Date('2000-01-01')
      };

      const [fakePersonId] = await db('pessoa').insert(fakePerson).returning('idPessoa');

      const fakeAccount = {
        saldo: 10000,
        limiteSaqueDiario: 10000,
        idPessoa: fakePersonId
      };

      const [fakeAccountId] = await db('conta').insert(fakeAccount).returning('idConta');

      request.setParams({
        id: String(fakeAccountId)
      });
      // @ts-ignore
      await accountController.block(request, response);

      const [registerAccount] = await db('conta').where('idConta', fakeAccountId);
      
      expect(registerAccount.flagAtivo).toBeDefined();
      expect(registerAccount.flagAtivo).toEqual(false);
      expect(response.statusCode).toEqual(204);

      await db('conta').where('idConta', fakeAccountId).del();
      await db('pessoa').where('idPessoa', fakePersonId).del();
    });
  });

  describe('#balance', () => {
    it('should retrieve the balance from an account', async () => {
      const request = new Request();
      const response = new Response();

      const container = {
        accountService: new AccountService({
          personModel: new PersonModel(db),
          accountModel: new AccountModel(db),
          transactionModel: new TransactionModel(db),
        }),
      };

      const accountController = new AccountController(container);

      const fakePerson = {
        nome: 'joao',
        cpf: '12341234123',
        dataNascimento: new Date('2000-01-01')
      };

      const [fakePersonId] = await db('pessoa').insert(fakePerson).returning('idPessoa');

      const fakeAccount = {
        saldo: 10000,
        limiteSaqueDiario: 10000,
        idPessoa: fakePersonId
      };

      const [fakeAccountId] = await db('conta').insert(fakeAccount).returning('idConta');

      request.setParams({
        id: String(fakeAccountId)
      });
      // @ts-ignore
      await accountController.balance(request, response);

      const [registerAccount] = await db('conta').where('idConta', fakeAccountId);
      
      expect(registerAccount).toBeDefined();
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        balance: (registerAccount.saldo / 100).toFixed(2)
      });

      await db('conta').where('idConta', fakeAccountId).del();
      await db('pessoa').where('idPessoa', fakePersonId).del();
    });
  });

  describe('#extract', () => {
    it('should retrieve all the extract from an account', async () => {
      const request = new Request();
      const response = new Response();

      const container = {
        accountService: new AccountService({
          personModel: new PersonModel(db),
          accountModel: new AccountModel(db),
          transactionModel: new TransactionModel(db),
        }),
      };

      const accountController = new AccountController(container);

      const fakePerson = {
        nome: 'joao',
        cpf: '12341234123',
        dataNascimento: new Date('2000-01-01')
      };

      const [fakePersonId] = await db('pessoa').insert(fakePerson).returning('idPessoa');

      const fakeAccount = {
        saldo: 10000,
        limiteSaqueDiario: 10000,
        idPessoa: fakePersonId
      };

      const [fakeAccountId] = await db('conta').insert(fakeAccount).returning('idConta');

      const fakeExtract = [
        {
          idConta: fakeAccountId,
          valor: 10000,
        },
        {
          idConta: fakeAccountId,
          valor: -10000,
        }
      ];

      await db('transacao').insert(fakeExtract);


      request.setParams({
        id: String(fakeAccountId)
      });
      // @ts-ignore
      await accountController.extract(request, response);

      const [registerAccount] = await db('conta').where('idConta', fakeAccountId);
      
      expect(registerAccount).toBeDefined();
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(2);

      await db('transacao').where('idConta', fakeAccountId).del();
      await db('conta').where('idConta', fakeAccountId).del();
      await db('pessoa').where('idPessoa', fakePersonId).del();
    });
  });
});
