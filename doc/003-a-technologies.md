# 003 A. Technologies

^ Back to [parent](./001-planification.md)

## Requirements set by instructions

Instructions are in the [README_en-EN.md](../README_en-EN.md) file.

- REST API
- product model and field types outlines

- [x] nodejs/express
- [ ] Java/Spring Boot
- [ ] C#/.net Core
- [ ] Python/Flask

## Summary

### Database

- [ ] JSON file
- [ ] Not Only SQL
  - [ ] MongoDB
  - [ ] other: ...
- [x] SQL
  - [ ] SQLite \
    (considered for prototyping)
  - [ ] MariaDb
  - [ ] MS SQL Server
  - [x] MySQL
  - [ ] PostGresql

#### Database abstraction

- [ ] ORM
- [x] Models
- [ ] None

### Others

- [x] Typescript
- [x] Built-in linter (TS/JS or Prettier)
- [x] OpenAPI schema
- [x] Built in test runner + light-my-request
- [x] Logging with winston
- [x] Docker + compose
- [x] Makefile (GNU make)
- [x] Github actions

## Stack selection

### Database technology

JSON:
- Our data could easily be managed inside a JSON file.
- Sufficient for a hack or early prototype.

As this is a demo, a containerized database service makes more sense than a JSON file.

NO-SQL:
- Great for denormalized data.
- Great for high read volumes.
- Great schema flexibility.

SQL:
- Great for relational data.
- Great for fixed schemas.

We deal with highly relational data similar to an inventory or sale system (or both). \
Our data model is static. \
This project will benefic more from higher reliability in the numbers (inventory, prices) than from faster data access.

SQLite as an early SQL substitute:
- Advantages of SQL.
- Single file.
- Great for native mobile apps.
- Great for embedded apps.
- Great for hacks and prototypes.

For prototyping in Alpha, we could substitute a SQL server for a SQLite driver. [Edit: scrapped in development.]

> Choice: SQL database server

### SQL flavor

- MariaDB
- MS SQL Server
- MySQL
- PostgreSQL

For this project I am choosing [MySQL](https://hub.docker.com/_/mysql) because of [MySQL Workbench](https://www.mysql.com/products/workbench/) available on Windows, MacOS and Linux.

MySQL Workbench is a cross-platform graphical design and management tool for MySQL.

> Choice: MySQL 8

### Database Abstraction

No ORM:
- Opiniated back end code.
- SQL statements built in code.
- Better for tightly integrated db-service-front apps.
- Simpler tests.

ORM:
- Better separation of concerns in code.
- Database agnostic code.
- Less flexibility.
- Better when database & backend systems are managed by different teams.

> Choice: no ORM

### JS vs Typescript

JS:
  - Sufficient for a project of this scale.
  - No build stage.
  - Simplifies dev dependency tree.
  - JSDoc typings.
  - Type pre-check available in modern editors.

TS:
  - Demo project, not a real life small project.
  - Added complexity is negligeable.

> Choice: Typescript

### Test suite

Built-in test-runner library:
  - Sufficient for the scale of this project.
  - Stable since v20.
  - TS support (npx tsx).
  - Native assertions & mocks.
  - No additional package required for unit tests.
  - Only one additional package required to test express app endpoints: [light-my-request](https://www.npmjs.com/package/light-my-request)
  - Fetch available since v21 for e2e.

Mocha+chai+...:
  - Sufficient for the scale of this project.
  - May require additional packages for unit tests and integration tests.

Jest:
  - Sufficient for the scale of this project.
  - May require additional package for e2e tests.

> Choice: Built-in test-runner

### Linter / Formatter

Eslint:
- Requires format configuration.
- Requires trigger configuration.
- Added dependencies.
- Adds a stage.

Prettier:
- Requires git hooks configuration.
- Added dependencies.
- Adds a stage.

Code Editor built-in linter:
- No dependency.
- No added stage if lint on save is on.

I took the counter-intuitive decision not to setup any automatic formatter or linter. \
This is a small demo, this is not a collaborative project with specific formatting or coding rules.
As I chose a format matching my personal preferences, I aim to keep a consistent formatting by hand. \
At times I will use VsCode built-in TS/JS formatter to fix spacings.

> Verdict: Built-in formatter

### Docker vs bare metal

Bare metal:
- Pollutes host OS.
- May lead to compatibility issues.
- May rely on global dependencies.
- Faster execution.
- All services must be installed.

Containers:
- Controlled environment.
- Build stages.
- No compatibility issues across containers.
- Easier to control multiple services.

> Choice: Docker + Compose

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

Winston allows to set up custom logging strategies. \
The strategy can be adapted to the deployment target later in the development cycle.

> Choice: Winston

### SSL / HTTPS

Secure:
- Requires a CA.
- Requires a fixed address / domain:port.
- Requires (self-)signing certificates.
- Requires install of self-signed certificates on clients.

Unsecure:
- Identical behavior.

Securing the demo does impact the behavior of the demo.

> Choice: Unsecure until RC.

### Makefile

This is a personal preference and habit.
I like to use documented makefile's to control installation, development and deployment.

See [README.md](../README.md) for more information.

# Next

[Conventions](./003-b-conventions.md)