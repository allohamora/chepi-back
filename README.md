# Chepi-back

Backend/api for cheppi.

## Links

- [Docs/Swagger](https://chepi-back-allohamora.cloud.okteto.net/api/)
- [Production link](https://chepi-back-allohamora.cloud.okteto.net)

## Used technologies

- [typescript](https://www.typescriptlang.org)
- [nest](https://nestjs.com)
- [swagger](https://swagger.io) as [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction)
- [meilisearch](https://www.meilisearch.com)
- [docker](https://www.docker.com)
- [okteto](https://okteto.com)
- [git-flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [convention-commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Options

| Key              | Value |
| ---------------- | ----- |
| Port             | 3000  |
| Swagger url      | /api  |
| Meilisearch port | 7700  |

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
# up pizzas dependencies
npm run pizzas:docker-compose up

# build pizzas.json
npm run pizzas:build

# down pizzas dependencies
npm run pizzas:docker-compose down
```
