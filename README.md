# meuml-app-web

Aplicação web para o administrador e o vendedor do MeuML.com

## Endereços

* Produção: https://app.meuml.com
* Staging: https://app.meuml.staging.gorillascode.com

## Desenvolvimento

### Instalação

Instalar o `grunt` e o `bower` caso não estejam instalados na máquina:

```sh
sudo npm -g install grunt-cli karma bower
```

Instalar os pacotes do NPM e do Bower:

```sh
npm install
bower install
```

### Build

Quando estiver alterando o projeto em ambiente de desenvolvimento, deve-se executar o comando:

```sh
grunt watch
```

## Implantação

### Build & Push

Esses comandos definem como se builda uma imagem e manda para o registry da gorillas

#### Staging Version (Development)

```
make push_develop
```

#### Release Version (Production)

1. Criar uma nova release usando o [git-flow](http://danielkummer.github.io/git-flow-cheatsheet/)
1. Atualizar o número da versão em `Makefile`, `bower.json` e `package.json` na release criada
1. Comitar as alterações referenciando a release a ser criada.
1. Finalizar a release
1. Executar os comandos abaixo substituindo VERSAO pela versão do release:

```
make push
```

### Deploy

Esses comando devem ser rodados dentro do projeto `gorillas-compose` em cada máquina que o componente roda.

#### Staging Version (Development)

```
docker-compose -f meuml.yml -f env-staging.yml pull meuml_app_web
docker-compose -f meuml.yml -f env-staging.yml up -d meuml_app_web
```

#### Release Version (Production)

```
docker-compose -f meuml.yml pull meuml_app_web
docker-compose -f meuml.yml up -d meuml_app_web
```

### Accessing

```
docker exec -it meuml_app_web /bin/bash
```

## Links Úteis

* [Estrutura do projeto](https://github.com/ngbp/ngbp#overall-directory-structure)