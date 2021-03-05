export type Account = {
    idConta: number;
    idPessoa: number;
    saldo: number;
    limiteSaqueDiario: number;
    flagAtivo: boolean;
    tipoConta: number;
    dataCriacao: Date;
};

export type CreateAccountRequestData = {
    personName: string;
    personDocument: string;
    personBirthdate: Date;
    dailyWithdrawalLimit?: number;
    accountType?: number;
}

export type CreateAccount = {
    idPessoa: number;
    limiteSaqueDiario: number;
    tipoConta: number;
}

export type AccountExtract = {
    operation: string;
    value: number;
    date: Date;
}

export interface IAccountService {
    getAccount(accountId: number): Promise<Account>;
    create(data: CreateAccountRequestData): Promise<void>;
    deposit(accountId: number, amount: number): Promise<object>;
    withdrawal(accountId: number, amount: number): Promise<object>;
    block(accountId: number): Promise<void>;
    getBalance(accountId: number): Promise<object>;
    getExtract(accountId: number, initialDate: string | null, finalDate: string | null): Promise<AccountExtract[]>;
}

export interface IAccountModel {
    findByPersonId(personId: number): Promise<Account>;
    findById(accountId: number): Promise<Account>;
    update(accountId: number, data: object): Promise<Account>;
    create(account: CreateAccount): Promise<Account>;
}
