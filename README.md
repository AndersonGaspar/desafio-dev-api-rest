# Anderson Gaspar

## Resumo
Olá augustosantesso, britoluan, jeffersonrodrigues92, nattanl, nilson-carraro e wesleyjoliveira.
Eu não desenvolvi a API Reset, pedir uma cópia para o Luiz Cardoso, que também está participando da seleção. 
Estou na seleção de DevOps.
Obrigado.

Foi feito provisionamento e testes em uma instância na AWS. Caso seja necessário posso deixar a instância ligada com acesso as portas necessárias para verificação. No momento ela se encontra desligada.
Estou disponível para maiores esclarecimentos, nos contatos:
email: anderson.medeiros@southsystem.com.br
whatsapp: +‎353 86 458 6242

## Provisioning Jenkins.
* Criado usuário no AWS IAM com policy AdministratorAccess
* Feito a instalação do AWS CLI no Ubuntu 20.04.
* Configurado no ~/.aws/credentials e ~/.aws/config as credenciais do usuário IAM.
* Criação dos códigos para provisionar o EC2 t2-small.
* Na pasta ~/IaC é executado o comando terraform init para inicializar o diretório de trabalho com os arquivos de configuração do Terraform.
* Executado o comando terraform apply para aplicar as configurações desejadas.
* Será exibido uma lista de alterações a serem criadas, alteradas ou destruidas.
* Após da confirmação das alterações, será impresso na tela as alterações realizadas.

## Provisioning and deploy a data structure store (like Jenkins)
* Na etapa anterior foi provisionada uma instância para a instalação do Jenkins pelo Ansible.
* Feito a instalçao do Ansible no Ubuntu 20.04.
* Executar o comando export ANSIBLE_PRIVATE_KEY_FILE=~/IaC/key.pub para deseginar a variável ANSIBLE_PRIVATE_KEY_FILE que será usada pelo Ansible para se conectar a instância.
* Duas opções para fazer a instalação do Jenkins:
    * Na pasta ~/IaC/Jenkins executar o comando ansible-playbook -b jenkins.yml --diff -vvvvvv para instalar e configurar o Jenkins.
    * Na pasta ~/IaC/Jenkins também exite um Dockerfile para a instalação do Jenkins.
* Na tela será impresso o status e o término do processo.

## Deploy a test app image (Jenkins pipeline)
* Criado um Dockerfile com a imagem do Jenkins com o docker instalado.
* Após fazer o build e rodar a imagem, o serviço do Jenkins estará disponível no localhost:8080.
* Fazer então as configurações iniciais do Jenkins e criar as crendicais do user Jenkins(Global)
* Fazer também a criação de um novo item, do tipo Pipeline e inserir o código do arquivo pipeline.json da pasta Jenkins.
* Nesse pipeline será configurado as variáveis de ambientes, clone do repositório do git, build da imagem Docker, deploy da imagem e a remoção da imagem ao finalizar.




## DOCK API test  (Luiz Cardoso)

### Description

This is a project developed as a test for the DOCK selection process for back-end developer. It uses Typescript, NodeJS and PostgreSQL.

### Requirements

If you want to run locally you will need:


- PostgreSQL Database

The database credentials can be set on a .env file using the .env.example as a template.
  
### First steps
#### Installing and database creation

```s

$ npm install

$ npm run migrate:latest

```

#### Testing the app

  

```s

$ npm run test

```

  

#### Running the app

```s

$ npm run start

```



### Desafio
Olá, queremos convidá-lo(a) a participar do nosso desafio de seleção.  Pronto(a) para participar? Seu trabalho será visto pelo nosso time e você receberá um feedback ao final sobre o que achamos do seu trabalho. Não é legal?

### Sobre a oportunidade 
A vaga é para Desenvolvedor(a), temos vagas com diversos níveis de senioridade e para cada um deles utilizaremos critérios específicos considerando este aspecto, combinado? 
Se você for aprovad(a) nesta etapa, será convidado para uma entrevista final.

### Desafio Técnico
  Nós trabalhamos com meios de pagamento e nada melhor do que um bom sistema para gestão de contas:
  
  - Pré-requisitos:
    ```
    * Desenvolver os recursos em API Rest que realizam operações bancárias com a entidade conta a seguir:
    ```
    | Contas | Tipo |
    |-|-|
    | idConta | Numérico |
    | idPessoa | Numérico |
    | saldo | Monetário |
    | limiteSaqueDiario | Monetário |
    | flagAtivo | Condicional |
    | tipoConta | Numérido |
    | dataCriacao | Data |

    ```
    * Tabela de transações realizadas na conta
    ```
    | Transacoes | Tipo |
    |-|-|
    | idTransacao | Numérico |
    | idConta | Numérico |
    | valor | Monetário |
    | dataTransacao | Data |

    ```
    * P.S.: Não é necessário realizar operações com a tabela pessoa, mas é necessária a criação da tabela para mapeamento da relação com a conta e enviar script de criação de pelo menos uma pessoa.
    ```

    | Pessoas | Tipo |
    |-|-|
    | idPessoa | Numérico |
    | nome | Texto |
    | cpf | Texto |
    | dataNascimento | Data |    

  - O que esperamos como escopo mínimo:
    ```
    * Implementar path que realiza a criação de uma conta;
    * Implementar path que realiza operação de depósito em uma conta;
    * Implementar path que realiza operação de consulta de saldo em determinada conta;
    * Implementar path que realiza operação de saque em uma conta;
    * Implementar path que realiza o bloqueio de uma conta;
    * Implementar path que recupera o extrato de transações de uma conta;
    ```
  - O que será diferencial:
    ```
    * Implementar extrato por período;
    * Elaborar manual de execução;
    * Elaborar documentação;
    * Elaborar testes.
    ```
    
  - O que vamos avaliar:
    ```
    * Seu código; 
    * Dockerfile ou docker-compose do serviço;
    * Script de banco;
    * Organização;
    * Boas práticas;
    * Diferenciais; 
    ```

  - Teste para o time de Arquitetura? 
    ```
    * Baseado no que foi desenvolvido nos envie uma solução da Arquitetura utilizando serviços na nuvem como a AWS (diferencial), Azure e GCP;
    * Junto com as instruções de execução, explique qual Design Pattern você utilizou e por que o escolheu para a sua solução.
    ```
  

### Instruções
      1. Faça o fork do desafio;
      2. Crie um repositório privado no seu github para o projeto e adicione como colaborador o usuário wesleyjoliveira;
      3. Desenvolva. Você terá 7 (sete) dias a partir da data do envio do desafio; 
      4. Após concluir seu trabalho faça um push; 
      5. Envie um e-mail à pessoa que está mantendo o contato com você durante o processo notificando a finalização do desafio para validação.