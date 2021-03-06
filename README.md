# Check File

Projeto para a disciplina de Cloud Computing da Universidade Federal do Ceará.

Esse projeto consiste em uma implementação de um cliente em Angular, que terá como propósito consumir informações de um servidor especificado [nesse outro repositório](https://github.com/pyduh/cloud-check-file.back).


## Instalação e Uso

Há três formas de utilizar essa aplicação: executando o `docker-compose` presente no [projeto servidor](https://github.com/pyduh/cloud-check-file.back) (instruções no README desse projeto), utilizando o [Docker](https://docs.docker.com/) ou instalando manualmente as dependências e iniciando o serviço.

Como o primeiro mecanismo está especificado no README do projeto servidor, farei a descrição dos últimos dois métodos.


### Docker

Para iniciar o projeto utilizando essa ferramenta, verifique se ela já se encontra [devidamente instalada](https://docs.docker.com/get-docker/). Verifique se os environments, `src/environments` estão devidamente configurados. 
Execute, então:

```
$ docker build -t cloud-check-file-front .
$ docker run --name cloud-check-file-front -d -p 8080:80 cloud-check-file-front
```

E entre, com seu navegador, no seguinte endereço `http://localhost:8080` para ter acesso ao sistema. 


### Instalação Manual

Para fazer a instalação das dependências desse projeto, verifique se o [Node e npm](https://nodejs.org/en/) e o [Angular](https://angular.io/) estão devidamente configurados. Execute:

```
$ npm install
$ ng s
```

Essa série de instruções será responsável por instanciar um servidor de desenvolvimento, sendo executado na porta `4200`, padrão do Angular.


## Autores

**Eduardo Neto** 
