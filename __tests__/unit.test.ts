import sinon from 'sinon';

import { Account, CreateAccountRequestData } from '../src/types/Account';
import { AccountService } from '../src/container/services/account';

describe('Unit tests', () => {

  describe('getAccount', () => {
    it('should return an account', async () => {
      const dbResult: Account = {
        idConta: 1,
        idPessoa: 1,
        limiteSaqueDiario: 100000,
        saldo: 0,
        flagAtivo: true,
        tipoConta: 1,
        dataCriacao: new Date('2020-01-01')
      };

      const context = {
        accountModel: {
          findById: sinon.fake.resolves(dbResult),
        },
        transactionModel: { },
        personModel: { },
      };

      // @ts-ignore
      const accountService = new AccountService(context);
      const result = await accountService.getAccount(1);

      expect(result).toEqual(dbResult);
      sinon.restore();
    });

    it('should throws when account is blocked', async () => {
      const dbResult: Account = {
        idConta: 1,
        idPessoa: 1,
        limiteSaqueDiario: 100000,
        saldo: 0,
        flagAtivo: false,
        tipoConta: 1,
        dataCriacao: new Date('2020-01-01')
      };

      const context = {
        accountModel: {
          findById: sinon.fake.resolves(dbResult),
        },
        transactionModel: { },
        personModel: { },
      };
      let error;

      // @ts-ignore
      const accountService = new AccountService(context);
      try {
        await accountService.getAccount(1);
      } catch (err) {
        error = err;
      }

      expect(error).toBeInstanceOf(Error);
      expect(error).toEqual(new Error('Ocorreu um erro ao buscar a conta: Error: Conta esta bloqueada'));
      sinon.restore();
    });

    it('should throws when account is not found', async () => {
      const context = {
        accountModel: {
          findById: sinon.fake.resolves(undefined),
        },
        transactionModel: { },
        personModel: { },
      };
      let error;

      // @ts-ignore
      const accountService = new AccountService(context);
      try {
        await accountService.getAccount(1);
      } catch (err) {
        error = err;
      }

      expect(error).toBeInstanceOf(Error);
      expect(error).toEqual(new Error('Ocorreu um erro ao buscar a conta: Error: Conta nao encontrada'));
      sinon.restore();
    });
  });

  describe('create', () => {
    it('should create a account and person', async () => {
      const context = {
        accountModel: {
          findByPersonId: sinon.fake.resolves(undefined),
          create: sinon.fake.resolves(1),
        },
        transactionModel: { },
        personModel: { 
          findByDocument: sinon.fake.resolves(undefined),
          create: sinon.fake.resolves([1]),
        },
      };

      // @ts-ignore
      const accountService = new AccountService(context);
      const requestData: CreateAccountRequestData = {
        personName: 'luiz',
        personDocument: '03822569054',
        personBirthdate: new Date('1996-02-14'),
        accountType: 1,
        dailyWithdrawalLimit: 1000.50
      }
      await accountService.create(requestData);

      expect(context.personModel.findByDocument.called).toBeTruthy();
      expect(context.personModel.findByDocument.getCall(0).args[0]).toEqual('03822569054');
      expect(context.personModel.create.called).toBeTruthy();
      expect(context.personModel.create.getCall(0).args[0]).toEqual({
        nome: 'luiz',
        cpf: '03822569054',
        dataNascimento: new Date('1996-02-14'),
      });
      expect(context.accountModel.findByPersonId.called).toBeTruthy();
      expect(context.accountModel.findByPersonId.getCall(0).args[0]).toEqual(1);
      expect(context.accountModel.create.called).toBeTruthy();
      expect(context.accountModel.create.getCall(0).args[0]).toEqual({
        idPessoa: 1,
        limiteSaqueDiario: requestData.dailyWithdrawalLimit * 100,
        tipoConta: requestData.accountType,
      });

      sinon.restore();
    });

    it('should only create a account', async () => {
      const context = {
        accountModel: {
          findByPersonId: sinon.fake.resolves(undefined),
          create: sinon.fake.resolves(1),
        },
        transactionModel: { },
        personModel: { 
          findByDocument: sinon.fake.resolves({
            idPessoa: 3
          }),
          create: sinon.fake.resolves(undefined),
        },
      };

      // @ts-ignore
      const accountService = new AccountService(context);
      const requestData: CreateAccountRequestData = {
        personName: 'luiz',
        personDocument: '03822569054',
        personBirthdate: new Date('1996-02-14'),
        accountType: 1,
        dailyWithdrawalLimit: 1000.50
      }
      await accountService.create(requestData);

      expect(context.personModel.findByDocument.called).toBeTruthy();
      expect(context.personModel.findByDocument.getCall(0).args[0]).toEqual('03822569054');
      expect(context.personModel.create.called).toBeFalsy();
      expect(context.accountModel.findByPersonId.called).toBeTruthy();
      expect(context.accountModel.findByPersonId.getCall(0).args[0]).toEqual(3);
      expect(context.accountModel.create.called).toBeTruthy();
      expect(context.accountModel.create.getCall(0).args[0]).toEqual({
        idPessoa: 3,
        limiteSaqueDiario: requestData.dailyWithdrawalLimit * 100,
        tipoConta: requestData.accountType,
      });

      sinon.restore();
    });

    it('should only create a account with the minimum necessary data', async () => {
      const context = {
        accountModel: {
          findByPersonId: sinon.fake.resolves(undefined),
          create: sinon.fake.resolves(1),
        },
        transactionModel: { },
        personModel: { 
          findByDocument: sinon.fake.resolves({
            idPessoa: 3
          }),
          create: sinon.fake.resolves(undefined),
        },
      };

      // @ts-ignore
      const accountService = new AccountService(context);
      const requestData: CreateAccountRequestData = {
        personName: 'luiz',
        personDocument: '03822569054',
        personBirthdate: new Date('1996-02-14')
      }
      await accountService.create(requestData);

      expect(context.personModel.findByDocument.called).toBeTruthy();
      expect(context.personModel.findByDocument.getCall(0).args[0]).toEqual('03822569054');
      expect(context.personModel.create.called).toBeFalsy();
      expect(context.accountModel.findByPersonId.called).toBeTruthy();
      expect(context.accountModel.findByPersonId.getCall(0).args[0]).toEqual(3);
      expect(context.accountModel.create.called).toBeTruthy();
      expect(context.accountModel.create.getCall(0).args[0]).toEqual({
        idPessoa: 3,
        limiteSaqueDiario: 1000000,
        tipoConta: undefined,
      });

      sinon.restore();
    });

    it('should throw when a person already has a account', async () => {
      const context = {
        accountModel: {
          findByPersonId: sinon.fake.resolves({
            idConta: 1
          }),
          create: sinon.fake.resolves(undefined),
        },
        transactionModel: { },
        personModel: { 
          findByDocument: sinon.fake.resolves({
            idPessoa: 3
          }),
          create: sinon.fake.resolves(undefined),
        },
      };

      // @ts-ignore
      const accountService = new AccountService(context);
      const requestData: CreateAccountRequestData = {
        personName: 'luiz',
        personDocument: '03822569054',
        personBirthdate: new Date('1996-02-14'),
        accountType: 1,
        dailyWithdrawalLimit: 1000.50
      }
      let error;
      try {
        await accountService.create(requestData);
      } catch (err) {
        error = err;
      }

      expect(context.personModel.findByDocument.called).toBeTruthy();
      expect(context.personModel.findByDocument.getCall(0).args[0]).toEqual('03822569054');
      expect(context.personModel.create.called).toBeFalsy();
      expect(context.accountModel.findByPersonId.called).toBeTruthy();
      expect(context.accountModel.findByPersonId.getCall(0).args[0]).toEqual(3);
      expect(context.accountModel.create.called).toBeFalsy();
      expect(error).toBeInstanceOf(Error);
      expect(error).toEqual(new Error('ocorreu um erro ao criar conta: Error: Pessoa ja possui conta'))

      sinon.restore();
    });
  });

  describe('deposit', () => {
    it('should make a deposit', async () => {
      const context = {
        accountModel: {
          findById: sinon.fake.resolves({
            idConta: 1,
            saldo: 15000,
            flagAtivo: true
          }),
          update: sinon.fake.resolves(1),
        },
        transactionModel: { 
          insert: sinon.fake.resolves([1]),
        },
        personModel: { },
      };

      // @ts-ignore
      const accountService = new AccountService(context);

      const depositValue = 100.32
      const newBalance = 15000 + depositValue * 100;

      const res = await accountService.deposit(1, depositValue);

      expect(context.accountModel.findById.called).toBeTruthy();
      expect(context.accountModel.update.called).toBeTruthy();
      expect(context.accountModel.update.getCall(0).args[1]).toEqual({
        saldo: newBalance
      });
      expect(context.transactionModel.insert.called).toBeTruthy();
      expect(context.transactionModel.insert.getCall(0).args[0]).toEqual({
        idConta: 1,
        valor: depositValue * 100,
      });

      expect(res).toEqual({
        newBalance: (newBalance / 100).toFixed(2)
      });

      sinon.restore();
    });

    it('should throws when an error happens', async () => {
      const context = {
        accountModel: {
          findById: sinon.fake.resolves({
            idConta: 1,
            saldo: 15000,
            flagAtivo: true
          }),
          update: sinon.fake.rejects('Error'),
        },
        transactionModel: { 
          insert: sinon.fake.resolves([1]),
        },
        personModel: { },
      };
      let error;

      // @ts-ignore
      const accountService = new AccountService(context);
      try {
        await accountService.deposit(1, 100.32);
      } catch (err) {
        error = err;
      }

      expect(error).toBeInstanceOf(Error);
      expect(error).toEqual(new Error('ocorreu um erro ao realizar um deposito: Error: Error'));
      sinon.restore();
    });
  });

  describe('withdrawal', () => {
    it('should make a withdrawal', async () => {
      const context = {
        accountModel: {
          findById: sinon.fake.resolves({
            idConta: 1,
            saldo: 15000,
            flagAtivo: true,
            limiteSaqueDiario: 10000000
          }),
          update: sinon.fake.resolves(1),
        },
        transactionModel: { 
          insert: sinon.fake.resolves([1]),
        },
        personModel: { },
      };

      // @ts-ignore
      const accountService = new AccountService(context);

      const depositValue = 100.32
      const newBalance = 15000 - depositValue * 100;

      const res = await accountService.withdrawal(1, depositValue);

      expect(context.accountModel.findById.called).toBeTruthy();
      expect(context.accountModel.update.called).toBeTruthy();
      expect(context.accountModel.update.getCall(0).args[1]).toEqual({
        saldo: newBalance
      });
      expect(context.transactionModel.insert.called).toBeTruthy();
      expect(context.transactionModel.insert.getCall(0).args[0]).toEqual({
        idConta: 1,
        valor: - depositValue * 100,
      });

      expect(res).toEqual({
        newBalance: (newBalance / 100).toFixed(2)
      });

      sinon.restore();
    });

    it('should throws when the daily withdrawal limit is greater than the withdrawal amount', async () => {
      const context = {
        accountModel: {
          findById: sinon.fake.resolves({
            idConta: 1,
            saldo: 15000,
            flagAtivo: true,
            limiteSaqueDiario: 1
          }),
          update: sinon.fake.resolves(1),
        },
        transactionModel: { 
          insert: sinon.fake.resolves([1]),
        },
        personModel: { },
      };
      let error;

      // @ts-ignore
      const accountService = new AccountService(context);
      try {
        await accountService.withdrawal(1, 100.32);
      } catch (err) {
        error = err;
      }

      expect(error).toBeInstanceOf(Error);
      expect(error).toEqual(new Error('ocorreu um erro ao realizar um saque: Error: saque solicitado eh maior que limite de saque'));
      sinon.restore();
    });

    it('should throws when the balance is lower than the withdrawal amount', async () => {
      const context = {
        accountModel: {
          findById: sinon.fake.resolves({
            idConta: 1,
            saldo: 1,
            flagAtivo: true,
            limiteSaqueDiario: 100000000
          }),
          update: sinon.fake.resolves(1),
        },
        transactionModel: { 
          insert: sinon.fake.resolves([1]),
        },
        personModel: { },
      };
      let error;

      // @ts-ignore
      const accountService = new AccountService(context);
      try {
        await accountService.withdrawal(1, 100.32);
      } catch (err) {
        error = err;
      }

      expect(error).toBeInstanceOf(Error);
      expect(error).toEqual(new Error('ocorreu um erro ao realizar um saque: Error: nao ha saldo suficiente para saque'));
      sinon.restore();
    });
  });

  describe('block', () => {
    it('should block an account', async () => {
      const context = {
        accountModel: {
          findById: sinon.fake.resolves({
            idConta: 1,
            saldo: 15000,
            flagAtivo: true,
            limiteSaqueDiario: 10000000
          }),
          update: sinon.fake.resolves(1),
        },
        transactionModel: { },
        personModel: { },
      };

      // @ts-ignore
      const accountService = new AccountService(context);

      await accountService.block(1);

      expect(context.accountModel.findById.called).toBeTruthy();
      expect(context.accountModel.update.called).toBeTruthy();
      expect(context.accountModel.update.getCall(0).args[1]).toEqual({
        flagAtivo: false
      });

      sinon.restore();
    });

    it('should throws when the account wasnt found', async () => {
      const context = {
        accountModel: {
          findById: sinon.fake.resolves(undefined),
          update: sinon.fake.resolves(1),
        },
        transactionModel: { },
        personModel: { },
      };
      let error;

      // @ts-ignore
      const accountService = new AccountService(context);
      try {
        await accountService.block(1);
      } catch (err) {
        error = err;
      }

      expect(context.accountModel.findById.called).toBeTruthy();
      expect(context.accountModel.update.called).toBeFalsy();
      expect(error).toBeInstanceOf(Error);
      expect(error).toEqual(new Error('ocorreu um erro ao bloquear a conta: Error: Conta nao encontrada'));
      sinon.restore();
    });

    it('should throws when the account is already blocked', async () => {
      const context = {
        accountModel: {
          findById: sinon.fake.resolves({
            idConta: 1,
            saldo: 15000,
            flagAtivo: false,
            limiteSaqueDiario: 10000000
          }),
          update: sinon.fake.resolves(1),
        },
        transactionModel: { },
        personModel: { },
      };
      let error;

      // @ts-ignore
      const accountService = new AccountService(context);
      try {
        await accountService.block(1);
      } catch (err) {
        error = err;
      }

      expect(context.accountModel.findById.called).toBeTruthy();
      expect(context.accountModel.update.called).toBeFalsy();
      expect(error).toBeInstanceOf(Error);
      expect(error).toEqual(new Error('ocorreu um erro ao bloquear a conta: Error: Conta ja esta bloqueada'));
      sinon.restore();
    });
  });

  describe('getBalance', () => {
    it('should return the account balance', async () => {
      const accountBalance = 15000;
      const context = {
        accountModel: {
          findById: sinon.fake.resolves({
            idConta: 1,
            saldo: accountBalance,
            flagAtivo: true,
            limiteSaqueDiario: 10000000
          }),
        },
        transactionModel: { },
        personModel: { },
      };

      // @ts-ignore
      const accountService = new AccountService(context);

      const res = await accountService.getBalance(1);

      expect(context.accountModel.findById.called).toBeTruthy();
      expect(res).toEqual({
        balance: (accountBalance / 100).toFixed(2)
      });

      sinon.restore();
    });

    it('should throws when an error happens', async () => {
      const context = {
        accountModel: {
          findById: sinon.fake.resolves(undefined),
        },
        transactionModel: { },
        personModel: { },
      };
      let error;

      // @ts-ignore
      const accountService = new AccountService(context);
      try {
        await accountService.getBalance(1);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(Error);
      expect(error).toEqual(new Error('ocorreu um erro ao buscar o saldo: Error: Ocorreu um erro ao buscar a conta: Error: Conta nao encontrada'));
      sinon.restore();
    });
  });

  describe('getExtract', () => {
    it('should return the account extract', async () => {
      const context = {
        accountModel: {
          findById: sinon.fake.resolves({
            idConta: 1,
            flagAtivo: true,
          }),
        },
        transactionModel: { 
          listByAccountId: sinon.fake.resolves([
            {
              dataTransacao: new Date('2020-01-01'),
              valor: -150000
            },
            {
              dataTransacao: new Date('2020-01-02'),
              valor: 150000
            },
          ])
        },
        personModel: { },
      };

      // @ts-ignore
      const accountService = new AccountService(context);

      const res = await accountService.getExtract(1, null, null);

      expect(context.transactionModel.listByAccountId.called).toBeTruthy();
      expect(context.transactionModel.listByAccountId.getCall(0).args[0]).toEqual(1);
      expect(res).toEqual([
        {
          operation: 'withdrawal',
          date: new Date('2020-01-01'),
          value: (150000 / 100).toFixed(2),
        },
        {
          operation: 'deposit',
          date: new Date('2020-01-02'),
          value: (150000 / 100).toFixed(2),
        },
      ]);

      sinon.restore();
    });

    it('should return the account extract with date', async () => {
      const context = {
        accountModel: {
          findById: sinon.fake.resolves({
            idConta: 1,
            flagAtivo: true,
          }),
        },
        transactionModel: { 
          listByAccountIdBetweenDates: sinon.fake.resolves([
            {
              dataTransacao: new Date('2020-01-01'),
              valor: -150000
            },
            {
              dataTransacao: new Date('2020-01-02'),
              valor: 150000
            },
          ]),
          listByAccountId: sinon.fake.resolves(undefined),
        },
        personModel: { },
      };

      // @ts-ignore
      const accountService = new AccountService(context);

      const initialDate = '2020-01-01';
      const finalDate = '2020-01-02';
      const res = await accountService.getExtract(1, initialDate, finalDate);

      expect(context.transactionModel.listByAccountId.called).toBeFalsy();
      expect(context.transactionModel.listByAccountIdBetweenDates.called).toBeTruthy();
      expect(context.transactionModel.listByAccountIdBetweenDates.getCall(0).args[1]).toEqual(initialDate);
      expect(context.transactionModel.listByAccountIdBetweenDates.getCall(0).args[2]).toEqual(finalDate);
      expect(res).toEqual([
        {
          operation: 'withdrawal',
          date: new Date('2020-01-01'),
          value: (150000 / 100).toFixed(2),
        },
        {
          operation: 'deposit',
          date: new Date('2020-01-02'),
          value: (150000 / 100).toFixed(2),
        },
      ]);

      sinon.restore();
    });

    it('should return empty when the account hasnt made any trasaction', async () => {
      const context = {
        accountModel: {
          findById: sinon.fake.resolves({
            idConta: 1,
            flagAtivo: true,
          }),
        },
        transactionModel: { 
          listByAccountId: sinon.fake.resolves([]),
        },
        personModel: { },
      };

      // @ts-ignore
      const accountService = new AccountService(context);
      const res = await accountService.getExtract(1, null, null);

      expect(context.transactionModel.listByAccountId.called).toBeTruthy();
      expect(res).toEqual([]);

      sinon.restore();
    });

    it('should throws when an error happens', async () => {
      const context = {
        accountModel: {
          findById: sinon.fake.resolves({
            idConta: 1,
            flagAtivo: true,
          }),
        },
        transactionModel: { 
          listByAccountId: sinon.fake.rejects('db error'),
        },
        personModel: { },
      };

      // @ts-ignore
      const accountService = new AccountService(context);
      let error;
      try {
        await accountService.getExtract(1, null, null);
      } catch (err) {
        error = err;
      }

      expect(context.transactionModel.listByAccountId.called).toBeTruthy();
      expect(error).toBeInstanceOf(Error);
      expect(error).toEqual(new Error('ocorreu um erro ao buscar o saldo: Error: db error'));

      sinon.restore();
    });
  });
})
