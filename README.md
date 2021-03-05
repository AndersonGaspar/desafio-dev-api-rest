# Anderson Gaspar

## Resumo
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
