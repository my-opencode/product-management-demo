# 004 Core features

^ Back to [parent](./001-planification.md)

## List

- [ ] GET /products
  - [x] Server initializes db connection (using secrets)
  - [x] Server listens to port
  - [x] Server default route --> 404
  - [x] Server default error handler --> 500
  - [x] Product model can select many from db
  - [x] Product model converts db result to array
  - [x] Product list view serializes array to JSON
  - [x] Server controller for route
    - empty array result is not an error
    - on applicative error --> 500
    - queries db throught model
    - serializes response body throught view
    - returns response body --> 200
  - [x] Server route for GET /products

- [x] POST /products
  - [x] Product model can validate fields
    - invalid --> 422
  - [x] Product model can insert to db
  - [x] Product model can select one from db
  - [x] Product model converts db result to obj
  - [x] Product view serializes obj to JSON
  - [x] Server route for POST /products
  - [x] Server controller for route
    - on applicative error --> 500
    - inserts into db throught model
    - duplicate error --> 409
    - missing fk error --> 409
    - serializes response body throught view
    - returns response body --> 201

- [x] GET /products/{id}
  - [x] Param middleware: validate id (later addition)
  - [x] Param middleware: pre fetch product (later addition)
  - [x] Server controller for route
    - ~~empty result is an error --> 404~~ (later edit)
    - no pre fetched product --> 404 (later edit)
    - on applicative error --> 500
    - ~~query db throught model~~ (later removal)
    - serializes response body throught view
    - return response body --> 200
  - [x] Server route for GET /products/{id}

- [x] PATCH /products/{id}
  - [x] Product model can validate changes
    - invalid --> 422
  - [x] Product model can update in db
  - [x] Server controller for route
    - no pre fetched product --> 404
    - on applicative error --> 500
    - update db throught model
    - serializes response body throught view
    - return response body --> 200
  - [x] Server route for PATCH /products/{id}

- [x] DELETE /products/{id}
  - [x] Product model can update as removed in db
  - [x] Server controller for route
    - on applicative error --> 500
    - update db throught model: deleted flag
    - return response --> 204
  - [x] Server route for DELETE /products/{id}

- [x] Integrated docker+compose serve/deploy

- [ ] Branch & version appropriately

# Next

[Optional features](./005-optional-features.md)