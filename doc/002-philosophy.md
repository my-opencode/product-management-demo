# 002 Philosophy

^ Back to [parent](./001-planification.md)

## Less is more.

- I prefer leaner dependency trees.
- I prefer simpler application structure with less abstraction.

## Middleware / Package organization

- I prefer a modular application where swapping a service or library only requires changing a middleware.

## "It works on my machine."

- I prefer to work with containers to control the environment.

## Guiding principles

- Keep production dependencies as few as possible.
  - Exceptions: Build, test and scaffold developement dependencies may be more numerous.
- Documentation in code.
  - Names should be as explicit as possible.
  - Functions, classes and methods should be documented in the code when deemed useful.
  - Tests should contribute to documenting behaviors and patterns.
- Separate concerns
  - Design should be based on patterns that separate concerns (~mvc).
- Use proper HTTP codes for responses.
  - Avoid `200 — {"error":"true"}` anti-patterns.
- Follow standardized formatting rules.
- Single source/version of truth.
- High test coverage.

- Generic principles to apply whenever possible
  - DRY - [don't repeat yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
  - YAGNI - [you are not going to need it](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)
  - KISS - [keep it stupid simple](https://en.wikipedia.org/wiki/KISS_principle)
  - SOLID - [5 principles for OOP](https://en.wikipedia.org/wiki/SOLID)
    - Single Responsibility Principle
    - Open/Closed Principle
    - Liskov Substitution Principle
    - Interface Segregation Principle
    - Dependency Inversion Principle

# Next

[Technologies selection](./003-a-technologies.md)