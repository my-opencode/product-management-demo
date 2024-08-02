# 001 Planification

- [x] [Philosophy](./002-philosophy.md)
- [x] [Select technologies](./003-technologies.md)
- [x] Plan deliverables
  - [Core features](./004-core-features.md)
  - [Nice to have features](./005-optional-features.md)
  - [Release Candidate](./006-release-candidate.md)
- [x] Architecture
  - [Database design](./007-database-design.md)
- [x] Set issues & milestones
  - [List of Tasks](./008-tasks.md)
  - Github milestones, labels, issues & project

## Project management & reporting

- Planning with the documentation.
- Setting milestones & issues on Github.
  - Using task lists as guidelines.
- Using Github project.
- Working on version, feature and issue branches.

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


# Next

[Philosophy](./002-philosophy.md)