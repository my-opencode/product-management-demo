# 003 B. Conventions

## Files

### Pattern

```file-name[.subdivision][.test-type][.test-flag].extension```

### Common rules

- Logical parts of a file name are separated by dots.
- Parts between square brackets are optional.
- All parts of a file name are in lower case.
- All parts of a file name are in kebad-case.

### file-name

- Required
- Words forming the file-name are arranged left to right in decreasing order of importance.
- When applicable the first word of file-name allows grouping.
- When applicable the file name should reflect the name of the default export.

### Optional: subdivision

- A subdivision indicates contents split from another file.
  - example: the SQL queries of the Product model (`models/product.ts`) are saved in a subdivision `models/products.queries.ts`.

### Optional: test-type

- Must be followed by a `.test` flag
- Test files may have a type:
  - unit: tests that can be run in isolation, no external services required. 
    - includes partial integration when external services are adressed with mocks.
  - integration: tests that require external services.
    - includes tests relying on the services of the `test-db.yaml` docker compose file.
    - excluding e2e using external tools.

### Optional: test-flag

- Indicates a test file for the test runner.

### extension

- File extension.

## Coding Conventions

Using common JS conventions as a base.

[syncfusion top 10 js naming conventions](https://www.syncfusion.com/blogs/post/top-javascript-naming-convention)
[W3C JS conventions](https://www.w3schools.com/js/js_conventions.asp)
[Google JS guide](https://google.github.io/styleguide/jsguide.html)
[MSDN JS writing style guide](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript)

Using Prettier default Typescript configuration is acceptable.

### Names

#### Meaningful names

As illustrated in Google JS guide [rules common to all identifiers](https://google.github.io/styleguide/jsguide.html#naming-rules-common-to-all-identifiers).

- Avoid abbreviations or one letter names.
- Prefer `MYSQL_PASSWORD` over `PASS`.
- Prefer `product` over `p`.
  - Exception for small closure with obvious context `products.map(p => p.code)`.
    - Not applicable in deeply nested closures.

#### Constant 'globals'

Applies to constant variables considered constants such as environment values.

- All-upper snake case.
  - THIS_IS_AN_EXAMPLE

#### Variables & functions returning a value

Applies to reassignable variables (let, var) and local constants (const).
Local means inside script file, class or function.

- Lower camel case.
  - thisIsAnExample

#### Classes, constructors & functions returning functions

- Upper camel case.
  - ThisIsAnExample

### Format

- Semi column: 
  - [x] always 
  - [ ] only required
- Indents: 
  - [ ] tab 
  - [x] 2 spaces 
  - [ ] 4 spaces

### Declarative vs imperative

Using both, deciding based on app logic and code readability.

Example with iteration over an array:

When logic ...
- is simple, `for...of` may win.
- requires both values and indexes, `.foreach((v,i))` may win.
- needs to control iterations, `for...of` or `for(a;b;c)` may win.
- is complex and self contained, `foreach(callback)` may win
- is complex and uses context variables, a `for` loop may win.
- depends on successive mutations and is not dependent on other values, a `for` loop may win.
- depends on successive mutations and is dependent on other values in the table, chaining methods such as `.map().filter().foreach()` may win.
- ...

## Database conventions

### Database name

Small case.
- example: "demodb"

### Database table name

Upper camel case.
- example: "ProductsPrices"

### Column names

Small snake case with exception. When a column name refers to another table (foreign key) the table name should be used as is.
- examples:
  - "rating"
  - "inventory_status"
  - "Products_id"

When multiple columns may refer to the same table column give unique meaningful names suffixed by the Table_column reference.
- Example with two tables `Users` and `Complaints`
  - Users:
    - id INT
    - name VARCHAR
  - Complaints:
    - id INT
    - file_identifier VARCHAR
    - contents JSON
    - `plaintiff_Users_id` INT
    - `defendant_Users_id` INT
    - `assigned_reviewer_Users_id` INT

### Normalization

Keep tables as normalized as makes sense for the application.

- Use a foreign key column for 1:1 or 1:m relationships.
  - example: Categories_id column in Products when a product may only belong to one category.
- Use a reference intermediary tables for  m:m relationships.
  - example: ProductsTags
    - id INT
    - Products_id INT
    - Tags_id INT

# Next

[Core features](./004-core-features.md)