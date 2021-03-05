export type Transaction = {
    idTransacao: number;
    idConta: number;
    valor: number;
    dataTransacao: Date;
};

export type InsertTransaction = {
    idConta: number;
    valor: number;
};

export interface ITransactionModel {
    insert(transaction: InsertTransaction): Promise<Transaction>
    listByAccountId(accountId: number): Promise<Transaction[]>
    listByAccountIdBetweenDates(accountId: number, initialDate: string, finalDate: string): Promise<Transaction[]>;
}
