# Chepi-back

back-end for chepi

## Links

- [Docs/Swagger](https://chepi-back-allohamora.cloud.okteto.net/swagger/)
- [Production link](https://chepi-back-allohamora.cloud.okteto.net)

## Used technologies

- [typescript](https://www.typescriptlang.org)
- [nest](https://nestjs.com)
- [swagger](https://swagger.io) as [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction)
- [elasticsearch](https://www.elastic.co)
- [docker](https://www.docker.com)
- [okteto](https://okteto.com)
- [git-flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [convention-commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Options

| Key                | Value    |
| ------------------ | -------- |
| Port               | 3000     |
| Swagger url        | /swagger |
| Elasticsearch port | 9200     |

## Running the app

```bash
# development
npm run start

# development in watch mode
npm run start:dev

# production
npm run start:prod

# start services
docker-compose up

# start services and chepi-back back-end in production mode
docker-compose --profile production up
```

## Test

```bash
# unit tests
npm run test

# unit tests in watch mode
npm run test:watch

# test coverage
npm run test:cov
```

## Pizzas

```bash
# pizzas docker-compose
npm run pizzas:docker-compose (up | down | etc)

# run pizzas.json build script
npm run pizzas:build:script

# needs docker and docker-compose
# build pizzas.json
npm run pizzas:build
```

Powered by [Google Translate](https://translate.google.com)
