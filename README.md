# Chepi-back

Backend/api for cheppi

## Used technologies
* [typescript](https://www.typescriptlang.org)
* [nest](https://nestjs.com)
* [swagger](https://swagger.io) as [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction)
* [meilisearch](https://www.meilisearch.com)
* [docker](https://www.docker.com)
* [okteto](https://okteto.com)

## Options
|        Key       |  Value |
|------------------|--------|
| Port             |  3000  |
| Swagger url      |  /api  |
| Meilisearch port |  7700  |

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
docker-compose up --profile production
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

## Build
```bash
# build pizzas.json
npm run build:pizzas
```