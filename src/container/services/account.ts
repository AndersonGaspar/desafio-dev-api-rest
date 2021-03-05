import { AccountModel } from '../models/account';
import { PersonModel } from '../models/person';
import { TransactionModel } from '../models/transaction';
import { IAccountService, CreateAccountRequestData, AccountExtract, Account } from '../../types/Account';
import { ServiceContext } from '../../types';

export class AccountService implements IAccountService {
  protected readonly accountModel: AccountModel;
  protected readonly personModel: PersonModel;
  protected readonly transactionModel: TransactionModel;

  constructor (context: ServiceContext) {
    this.accountModel = context.accountModel;
    this.personModel = context.personModel;
    this.transactionModel = context.transactionModel;
  }

  async getAccount(accountId: number): Promise<Account> {
    try {
      const account = await this.accountModel.findById(accountId);
      if (!account) {
        throw new Error('Conta nao encontrada');
      }

      if (!account.flagAtivo) {
        throw new Error('Conta esta bloqueada');
      }

      return account;
    } catch (err) {
      throw new Error(`Ocorreu um erro ao buscar a conta: ${err}`);
    }
  }

  async create(data: CreateAccountRequestData): Promise<void> {
    const {
      personName,
      personDocument,
      personBirthdate,
      accountType,
      dailyWithdrawalLimit,
    } = data;

    try {
      let idPessoa = 0;
      const person = await this.personModel.findByDocument(personDocument);

      if (!person) {
        const createdPerson = await this.personModel.create({
          nome: personName,
          cpf: personDocument,
          dataNascimento: personBirthdate,
        });
        idPessoa = createdPerson[0];
      } else {
        idPessoa = person.idPessoa;
      }

      const account = await this.accountModel.findByPersonId(idPessoa);

      if (account) {
        throw new Error('Pessoa ja possui conta');
      }

      const limiteSaqueDiario = dailyWithdrawalLimit ? dailyWithdrawalLimit * 100 : 1000000;

      await this.accountModel.create({
        idPessoa,
        limiteSaqueDiario,
        tipoConta: accountType,
      });

      return;
    } catch (err) {
      throw new Error(`ocorreu um erro ao criar conta: ${err}`);
    }
  }

  async deposit(accountId: number, amount: number): Promise<object> {
    try {
      const account = await this.getAccount(accountId);

      const depositAmount = (amount * 100);
      const newBalance = Number(account.saldo) + depositAmount;

      await this.accountModel.update(accountId, {
        saldo: newBalance,
      });

      await this.transactionModel.insert({
        idConta: accountId,
        valor: depositAmount,
      });

      return {
        newBalance: Number(newBalance / 100).toFixed(2),
      };
    } catch (err) {
      throw new Error(`ocorreu um erro ao realizar um deposito: ${err}`);
    }
  }

  async withdrawal(accountId: number, amount: number): Promise<object> {
    try {
      const account = await this.getAccount(accountId);

      if (amount * 100 > Number(account.limiteSaqueDiario)) {
        throw new Error('saque solicitado eh maior que limite de saque');
      }

      const withdrawalAmount = (amount * 100);
      const newBalance = Number(account.saldo) - (amount * 100);

      if (newBalance < 0) {
        throw new Error('nao ha saldo suficiente para saque');
      }

      await this.accountModel.update(accountId, {
        saldo: newBalance,
      });

      await this.transactionModel.insert({
        idConta: accountId,
        valor: - withdrawalAmount,
      });

      return {
        newBalance: Number(newBalance / 100).toFixed(2),
      };
    } catch (err) {
      throw new Error(`ocorreu um erro ao realizar um saque: ${err}`);
    }
  }

  async block(accountId: number): Promise<void> {
    try {
      const account = await this.accountModel.findById(accountId);
      if (!account) {
        throw new Error('Conta nao encontrada');
      }

      if (!account.flagAtivo) {
        throw new Error('Conta ja esta bloqueada');
      }

      await this.accountModel.update(accountId, {
        flagAtivo: false,
      });

      return;
    } catch (err) {
      throw new Error(`ocorreu um erro ao bloquear a conta: ${err}`);
    }
  }

  async getBalance(accountId: number): Promise<object> {
    try {
      const account = await this.getAccount(accountId);

      const balance = (Number(account.saldo) / 100).toFixed(2);

      return {
        balance,
      };
    } catch (err) {
      throw new Error(`ocorreu um erro ao buscar o saldo: ${err}`);
    }
  }

  async getExtract(accountId: number, initialDate: string | null, finalDate: string | null): Promise<AccountExtract[]> {
    try {
      const account = await this.getAccount(accountId);

      let extract = [];
      const result = [];

      if (initialDate && finalDate) {
        extract = await this.transactionModel.listByAccountIdBetweenDates(account.idConta, initialDate, finalDate);
      } else {
        extract = await this.transactionModel.listByAccountId(account.idConta);
      }

      if (extract.length > 0) {
        extract.forEach((data) => {
          let operation = 'deposit';
          if (data.valor < 0) {
            operation = 'withdrawal';
          }
          result.push({
            operation,
            value: (Math.abs(data.valor) / 100).toFixed(2),
            date: data.dataTransacao,
          });
        });
        return result;
      }
      return [];
    } catch (err) {
      throw new Error(`ocorreu um erro ao buscar o saldo: ${err}`);
    }
  }

}
