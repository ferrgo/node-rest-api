## Shopping Cart with Promo discounts

## Running

### Using yarn

Have [Yarn](https://yarnpkg.com/) installed locally:

```sh
yarn
yarn run start:dev
```

This will run using nodemon to allow hotreload of app

### Using Docker-compose

This project can be run using docker and docker-compose to avoid local dependencies installing, you'll need docker and docker-compose installed

See [Dockerfile.dev](./Dockerfile.dev) and [docker-compose.dev.yaml](./docker-compose.dev.yaml) for details

- docker
- docker-compose

```sh
docker-compose -f docker-compose.dev.yaml up --build
```

This will start the server with [nodemon](https://nodemon.io/) and watch for file changes

## Testing

### Using yarn

Have [Yarn](https://yarnpkg.com/) installed locally:

```sh
yarn
yarn run test:cov
```

This will run jest to execute tests and create coverage report

### Using Docker-compose

This projects tests can be run using docker and docker-compose to avoid local dependencies installed, you'll need docker and docker-compose installed

See [Dockerfile.dev](./Dockerfile.dev) and [docker-compose.test.yaml](./docker-compose.test.yaml) for details

- docker
- docker-compose

```sh
docker-compose -f docker-compose.test.yaml up --build
```

This will run tests with coverage and log report on [/coverage](./coverage/). A HTML can be found to check coverage details [./coverage/tests/lcov-report/index.html](./coverage/tests/lcov-report/index.html)
