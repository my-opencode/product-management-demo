# Product Management Demo

This project's goal is to build a product management back end to showcase one's abilities to fulfill requirements but more importantly to showcase one's work ethic and methodology.

# 01 Planification

- [x] Philosophy
- [ ] Select technologies
- [ ] Plan deliverables
- [ ] Set issues & milestones

## Philosophy

Less is more.
I prefer to work with leaner dependency trees.
I also prefer to have a simpler application structure.
My preference will show in the design and stack decisions.

Overall, I intent to keep production dependencies as few as possible. Build, test and scaffold developement dependencies may be more numerous.

Functions, classes and methods should be documented in the code.
Names should be as explicit as possible.

The requirements already set some basic rules:

- javascript
- node.js
- express.js
- REST API
- product model and field types

### JS vs Typescript

With modern tooling it is possible to work directly in JS and have TS toolings ensure type safety using JSDoc.

Choosing JS for a smaller size project makes much more sense as it does not require a build stage and associated tooling.

We may argue that the front end is in TS and both codebases could share dependencies. In practise, it is seldom the case.

As this project is not a real life small project but a demo, it makes more sense to select TS over JS. TS trades added complexity for scalibility.

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
- Class vs Object: [x] CLass [ ] Object
  Typescript prefers classes anyway

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

## Technologies

### Core stack

- [x] nodejs/express
- [ ] Java/Spring Boot
- [ ] C#/.net Core
- [ ] Python/Flask

### Others

- [x] Typescript
- [x] Buil in linter
- [x] OpenAPI tooling
- [x] Built in test library
- [x] Docker + compose
- [x] Makefile

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

# 02 Setup

- [ ] Set up tooling (if applicable)
- [ ] Set up testing suite
- [ ] Set up CI/CD
- [ ] Configure the project (package.json, ...)
- [ ] Set up DB

# 03 Core features

- [ ] Implement core features
  - [ ] GET /products
  - [ ] POST /products
  - [ ] GET /products/{id}
  - [ ] PATCH /products/{id}
  - [ ] DELETE /products/{id}
- [ ] Implement testing
  - [ ]
- [ ] Branch & version appropriately

# 04 Nice to have features

- [ ] Auth system
  - [ ] mw
  - [ ] routes
- [ ] RBAC system
  - [ ] mw
  - [ ] routes

# 05 RC

When applicable

    migrate prototype env to a prod env
    harden features
    migrate to prod DB
