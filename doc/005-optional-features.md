# 005 Nice to have features

^ Back to [parent](./001-planification.md)

## List

- [x] Update Front-End
  - [x] Product service API calls
  - [x] Product model
  - [x] Product edit form config
  - [x] Mock Category service API calls
  - [x] Replace Category service API mock calls

- [x] GET /categories
  - [x] Category model can select many from db
  - [x] Category model converts db result to array
  - [x] Category list view serializes array to JSON
  - [x] Server controller for route
    - empty array result is not an error
    - on applicative error --> 500
    - queries db throught model
    - serializes response body throught view
    - returns response body --> 200
  - [x] Server route for GET /categories

- [ ] Offline DB failsafe
  - [ ] mw: offline db failsafe: 
    - checks for db connection status
    - db offline --> 503

- [ ] Deletion metadata
  - [ ] Transform Products.deleted from TINYINT to DATE
    - set as deleted with deleted = date
    - select active with deleted is null

- [ ] DataHistory implementation
  - [ ] Decide strategy
    - [ ] Through code
      - [ ] Product model logs CRUD operations to db
      - [ ] Category model logs CRUD operations to db
    - [ ] Inside db
      - [ ] Add insert triggers
      - [ ] Add update triggers
      - [ ] Add delete triggers
      - [ ] Update stored procedures
  - [ ] Implement strategy

- [ ] GET /products/changes
  - [ ] DataHistory model can read db records
  - [ ] DataHistory model converts db results to array
  - [ ] View converts array to JSON
  - [ ] Server controller for route
    - empty result is not an error --> 200 []
    - on applicative error --> 500
    - query db throught model
    - serializes response body throught view
    - return response body --> 200
  - [ ] Server route for DELETE /products/{id}

- [ ] User support
  - [ ] User model can select many from db
  - [ ] User model can select one from db
  - [ ] User model converts one to obj
  - [ ] User model converts many to array
  - [ ] User view converts array to JSON
  - [ ] User view converts obj to JSON
  - [ ] Param middleware: pre fetch user
  - [ ] controller for user list route
    - empty result is not an error --> 200 []
    - on applicative error --> 500
    - query db throught model
    - serializes response body throught view
    - return response body --> 200
  - [ ] controller for get user by id route
    - no pre fetched user --> 404
    - on applicative error --> 500
    - serializes response body throught view
    - return response body --> 200

- [ ] Auth system
  - [ ] Decide to implement or mock
    - [ ] login controller
        - login error --> 401
        - login success --> 200 + session/token
    - [ ] logout controller
    - [ ] server route for POST /login
    - [ ] server route for GET /logout
  - [ ] Update Front-End
    - auth service
    - user service
    - user menu
    - login buttons
      - user A admin
      - user B superviser 
      - user C employee
      - user D customer
    - logout button
    - security based on auth system requirements
    - request headers
  - [ ] authRequired middleware verifies login status
    - user not logged --> 401
  - [ ] Protect auth routes
    - get product details
    - get category list
    - patch product details
    - delete product
    - get user list
    - get logout

- [ ] RBAC system
  - [ ] Decide to implement or mock
  - [ ] Prepulate resources & user privileges
    - customer
      - get product details
    - employee
      - all customer accesses
      - patch product details
      - get user list
    - superviser
      - all employee accesses
      - delete product
    - admin:
      - all superviser accesses
      - get data history
  - [ ] roleRequired Middleware 
    - verifies user role against route required role
      - unauthorized --> 403

# Next

[Release candidate features](./006-release-candidate.md)