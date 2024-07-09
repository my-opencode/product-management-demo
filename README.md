# Product Management Demo

This project's goal is to build a product management back end to showcase one's abilities to fulfill requirements but more importantly to showcase one's work ethic and methodology.

# 01 Planification

- [x] Philosophy
- [x] Select technologies
- [x] Plan deliverables
- [ ] Set issues & milestones

## Philosophy & design principles

Less is more.
I prefer to work with leaner dependency trees.
I also prefer to have a simpler application structure.
My preference will show in the design and stack decisions.

Keep production dependencies as few as possible.
Build, test and scaffold developement dependencies may be more numerous.

Functions, classes and methods should be documented in the code.
Names should be as explicit as possible.

The backend design should separate concerns (~mvc).

Use proper HTTP codes for responses. No: `200 — {"error":"true"}` shenanigans.

## Requirements

The requirements already set some basic rules:

- javascript
- node.js
- express.js
- REST API
- product model and field types

## Stack decision process

### JS vs Typescript

With modern tooling it is possible to work directly in JS and have TS toolings ensure type safety using JSDoc.

Choosing JS for a smaller size project makes much more sense as it does not require a build stage and associated tooling.

We may argue that the front end is in TS and both codebases could share dependencies. In practise, it is seldom the case.

As this project is not a real life small project but a demo, it makes more sense to select TS over JS. TS trades added complexity for scalability.

Verdict: Typescript

### Dedicated linter vs code editor built in TS linter

A dedicated linter makes more sense for a larger team with varying personal preferences and looser coding rules.

As this is a demo and a smaller size project, since we already went for TS, there is no real need to install a dedicated linter like prettier.

I will personally be using VSCode TS/JS formatter.

Verdict: Built-in

### Formatting rules

Arbitrary decision:

- Semi column: [x] always [ ] only required
- Indents: [ ] tab [x] 2 spaces [ ] 4 spaces
- Name case: [x] CamelCase [ ] snake_case [ ] kebab-case
- Filename case: [ ] CamelCase [ ] snake_case [x] kebab-case
- Class vs Object: [x] CLass [ ] Object
  (Typescript prefers classes anyway)

### SQL vs NO-SQL vs SQLite vs JSON

Our data is only one table and can easily be managed inside a JSON file.

In the real world however, products most likely mean we're dealing with an inventory or sale system (or both) which means higly relational data where SQL shines over NO-SQL.
Our data model is also static which wouldn't take advantage of NO-SQL flexibility.

As for SQL vs SQLite, SQLite may be a much better choice for prototyping and early testing with only minor syntax changes when migrating to a SQL server in beta or RC.

An ORM could be a great solution to allow changing the DB system later in the development cycle. However the abstraction layer adds obfuscation and complexity that would need to be tested, less is more, no ORM.

Verdict: (possibly SQLite then) SQL

### OpenAPi / Swagger vs no tool

The benefits of using an OpenAPI tooling are many:
- clarity of the API definition
- auto generated documentation
- scaffolding
- testing
- front-end framework generation

Verdict: OpenAPI

### Test suite

Node.js built in testing library is very capable.
The functionalities it lacks at the time of this demo are not extremely important for our use case.

TS support is also really good.

Jest, vitest or mocha-chai would all be good enough choices.

Verdict: built-in

### Docker vs bare metal

Before containerization was widespread, how many times did we hear "It works on my machine."?
We already have a build process with TS, a docker buid is a one time setup addition.

Added to compose just makes startup easier especially with a SQL server.

Verdict: Docker

### Makefile

This is a personal preference/habit from complex mono repos on linux servers.
I like to use documented makefile's to control installation, development and deployment.

Verdict: makefile

### Project management & reporting

Github milestones & issues is a wonderful tool good enough for teams, a little overkill for a small project but the integration with VSCode extensions is a great experience as it allows to easily work on dedicated branches for each issue. Good planification and feature-issues improve development a lot.

Verdict: Github issues

### Github actions

Integrate CI, build & tests to Github actions for automated tests.

```yaml
# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x, 22.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test
```

Verdict: use actions

### SSL / HTTPS

Fairly simple to implement with a Nginx docker.
Requires the ability to generate valid SSL certificates, or, to create a private CA, self sign certificates, add certificates to the client machines. Quite a lot of hassle for a demo.

Perhaps as a nice to have or RC feature.

Verdict: TBD

### Logging

Sensible logging should happen in production.
As we work in docker we have two options:
- log to stdout and use docker logs
  - compatible with Kubernetes
  - requires setting a log driver for docker container
  - Possible option [https://docs.docker.com/config/containers/logging/configure/#configure-the-default-logging-driver](https://docs.docker.com/config/containers/logging/configure/#configure-the-default-logging-driver)
- log management in nodejs throught a mounted volume
  - winston?
  - morgan?

Verdict: Logging via docker logs + driver

### Data history

When not dealing with a genuine user request for deletion of personal data, and when volumes don't make costs prohibitive, keeping a history of all data changes is a great safeguard, allowing to rebuild a previous state of the db, audit user actions and prevent malicious or erroneous data losses.

Verdict: Implement Data history

## Technologies

### Core stack

- [x] nodejs/express
- [ ] Java/Spring Boot
- [ ] C#/.net Core
- [ ] Python/Flask

### Others

- [x] Typescript
- [x] Built-in linter
- [x] OpenAPI tooling
- [x] Built in test library
- [x] Docker + compose
- [x] Makefile
- [x] Github actions
- [x] Https maybe
- [x] Logging

#### Database

- [ ] JSON file
- [ ] Not Only SQL
  - [ ] MongoDB
  - [ ] other: ...
- [x] SQL
  - [ ] SQLite
  - [ ] MS SQL Server
  - [ ] PostGresql
  - [ ] MariaDb
  - [ ] MySQL

#### Database abstraction

- [ ] ORM
- [x] Models
- [ ] None

## Tasks & Deliverables

1. Complete dev setup
2. Dockerize DB server + express server (one route)
3. Implement core features & associated tests
4. Implement additional features & tests
5. Prepare RC
6. Production version

## Milestones & Issues

- [ ] 02 setup issues
- [ ] 03 core feature issues
- [ ] 04 additional feature issues
- [ ] 05 rc feature issues

# 02 Setup

- [x] init git
- [ ] init npm
- [ ] install TS + tsconfig
- [ ] install OpenAPI tools
- [ ] openapi.yaml
- [ ] install Express
- [ ] stub files & directories
  - back-built
  - back/server.ts
  - back/server.test.ts
  - back/router.ts
  - back/router.test.ts
  - back/databases/sql-connection.ts
  - back/databases/sql-connection.test.ts
  - [back/databases/sqlite-connection.ts]
  - [back/databases/sqlite-connection.test.ts]
  - back/models/Products.ts
  - back/models/Products.test.ts
  - back/models/Users.ts
  - back/models/Users.test.ts
  - back/models/Roles.ts
  - back/models/Roles.test.ts
  - back/models/DataHistory.ts
  - back/models/DataHistory.test.ts
  - back/controllers/products-get-all.ts
  - back/controllers/products-get-all.test.ts
  - back/controllers/products-post-new.ts
  - back/controllers/products-post-new.test.ts
  - back/controllers/product-get-details.ts
  - back/controllers/product-get-details.test.ts
  - back/controllers/product-patch-fields.ts
  - back/controllers/product-patch-fields.test.ts
  - back/controllers/product-delete-one.ts
  - back/controllers/product-delete-one.test.ts
  - back/middlewares/security-auth.ts
  - back/middlewares/security-auth.test.ts
  - back/middlewares/security-role.ts
  - back/middlewares/security-role.test.ts
  - back/middlewares/failsafe-db-offline.ts
  - back/middlewares/failsafe-db-offline.test.ts
  - back/middlewares/logger.ts
  - back/middlewares/logger.test.ts
  - back/views/Products.ts
  - back/views/Products.test.ts
  - back/views/Users.ts
  - back/views/Users.test.ts
  - back/views/UserRoles.ts
  - back/views/UserRoles.test.ts
  - back/views/DataHistory.ts
  - back/views/DataHistory.test.ts
- [ ] dummy build step
- [ ] Dockerfile
- [ ] DB setup script
- [ ] Docker compose
- [ ] Docker log driver (local rotation)
- [ ] Set up testing suite
- [ ] Set up Github CI/CD Action
  - build
  - test
  [ ] makefile

# 03 Core features

- [ ] GET /products
  - [ ] Server initializes db connection (using secrets)
  - [ ] Server listens to port
  - [ ] Server default route --> 404
  - [ ] Server mw: failsafe when db offline --> 503
  - [ ] Product model can select from db
  - [ ] DataHistory model can insert to db
  - [ ] Product model can serialize db response into JSON
  - [ ] Server route for GET /products
  - [ ] Server controller for route
    - empty result is not an error
    - on applicative error --> 500
    - query db throught model
    - serializes response throught view
    - return response --> 200
- [ ] POST /products
  - [ ] Server mw: auth not logged --> 401
  - [ ] Server mw: role not matched --> 403
  - [ ] Product model can validate fields
    - invalid --> 422
  - [ ] Product model can insert to db
  - [ ] Product model can serialize db response into JSON
  - [ ] Server route for POST /products
  - [ ] Server controller for route
    - on applicative error --> 500
    - insert db throught model
    - (should not happen) exists error --> 409
    - serializes response throught view
    - return response --> 201
- [ ] GET /products/{id}
  - [ ] Server route for GET /products/{id}
  - [ ] Server controller for route
    - empty result is an error --> 404
    - on applicative error --> 500
    - query db throught model
    - serializes response throught view
    - return response --> 200
- [ ] PATCH /products/{id}
  - [ ] Product model can validate patch fields
    - invalid --> 422
  - [ ] Product model can update in db
  - [ ] Product model can serialize db response into JSON
  - [ ] Server route for PATCH /products/{id}
  - [ ] Server controller for route
    - on applicative error --> 500
    - update db throught model
    - serializes response throught view
    - return response --> 201
- [ ] DELETE /products/{id}
  - [ ] Product model can update as removed in db
  - [ ] Server route for DELETE /products/{id}
  - [ ] Server controller for route
    - on applicative error --> 500
    - update db throught model: deleted flag + date
    - return response --> 204
      or 202 if async and queued
- [ ] Branch & version appropriately

# 04 Nice to have features

- [ ] SSL Certificate for HTTPS
- [ ] Auth system
  - [ ] mw
  - [ ] routes
- [ ] RBAC system
  - [ ] mw
  - [ ] routes

# 05 RC

When applicable

- [ ] migrate prototype env to a prod env
- [ ] harden features
- [ ] migrate to prod DB
