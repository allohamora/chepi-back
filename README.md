# Chepi-back

Backend/api for cheppi.

## Links

- [Docs/Swagger](https://chepi-back-allohamora.cloud.okteto.net/api/)
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

| Key                | Value |
| ------------------ | ----- |
| Port               | 3000  |
| Swagger url        | /api  |
| Elasticsearch port | 9200  |

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod

# dependencies
docker-compose up

# in docker with dependencies
docker-compose --profile production up
```

## Test

```bash
# unit tests
npm run test

# libs unit tests
npm run test:libs

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Pizzas

```bash
# pizzas docker-compose npm run wrapper
npm run pizzas:docker-compose (up | down | etc)

# run pizzas.json build script
npm run pizzas:build:script

# needs docker and docker-compose
# build pizzas.json
npm run pizzas:build
```
