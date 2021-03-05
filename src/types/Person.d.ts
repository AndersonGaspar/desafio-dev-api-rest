export type Person = {
    idPessoa: number;
    nome: string;
    cpf: string;
    dataNascimento: Date;
};

export type CreatePerson = {
    nome: string;
    cpf: string;
    dataNascimento: Date;
}

export interface IPersonModel {
    findByDocument(document: string): Promise<Person>;
    create(person: CreatePerson): Promise<number>
}
