create table pessoa (
	idPessoa SERIAL primary key,
	nome VARCHAR(60) not null,
	cpf VARCHAR(11)  unique not null,
	dataNascimento DATE not null
);

create table conta (
	idConta SERIAL primary key,
	idPessoa INT not null,
	saldo bigint not null default 0,
	limiteSaqueDiario bigint not null default 100000,
	flagAtivo bool not null default true,
	tipoConta int,
	dataCriacao date not null default current_date,
	foreign key (idPessoa) 
		references pessoa (idPessoa)
);

create table transacao (
	idTransacao SERIAL primary key,
	idConta int not null,
	valor bigint not null,
	dataTransacao DATE not null default current_date,
	foreign key (idConta)
		references conta (idConta)
);
