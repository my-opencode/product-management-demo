# Product Management Demo

This project is a coding test. \
Instructions are in the [README_en-EN.md](./README_en-EN.md) file. The goal  to build a product management back end to showcase coding abilities, decision making and methodologies.

# Getting started

- On a Linux+GNU machine, [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) or [Linux VM](https://dev.to/iaadidev/linux-virtualization-simple-guide-for-new-users-2hdh).
- Clone the repository:
  ```bash
  git clone https://github.com/my-opencode/product-management-demo.git
  ```
- Open this clone directory:
  ```bash
  cd product-management-demo
  ```
- Confirm that you have [GNU make](https://www.incredibuild.com/integrations/gnu-make) installed:
  ```bash
  make --version
  ```
- Run:
  ```bash
  make start-all;
  ```

## Requirements

- [Docker + compose](https://docs.docker.com/compose/install/).

### Requirements for Local install, tests and serving apps

- [Nodejs 22](https://nodejs.org/en/download/package-manager) (not tested on 18/20).
- [NPM 10](https://nodejs.org/en/download/package-manager).

## Using the Makefile

For convenience, I provide a `makefile` with commands for most common actions.

> A Makefile is a text file in which we can define named command collections (later referenced as macro for clarity). \
Macros can be called with `make macro-name` in a terminal.

Try `make help` or open the `makefile` for more information about the macros.


> The macros in the Makefile are for bash and have not been tested outside of a GNU+Linux environment.
On Windows or MacOS I strongly recommend using Linux WSL or a VM.

# Run tests

NPM is required

```bash
make test-back
```
or
```bash
cd back
npm ci
npm run test
```

# Planification

See how the project has been planned in [001-planification.md](./doc/001-planification.md).

More:
- List of tasks in [008-tasks.md](./doc/008-tasks.md).
- List of core features in [004-core-features.md](./doc/004-core-features.md).
- List of optional features in [005-optional-features.md](./doc/005-optional-features.md).
- List of RC checks in [006-optional-features.md](./doc/006-release-candidate.md).

More:
- Find the OpenAPI schema in [openapi.yaml](./back/openapi.yaml).
