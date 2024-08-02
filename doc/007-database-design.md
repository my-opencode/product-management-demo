# 007 Database design

^ Back to [parent](./001-planification.md)

## Tables design

![Database Schemas](../database_model.png)

### Products

Adapting model from the provided `products.json`.

<table border="1">
  <thead style="font-weight:bold">
    <tr>
    <td>Operation</td>
    <td>Field</td>
    <td>Description</td>
    </tr>
  </thead>
  <tr>
    <td>Normalize</td>
    <td>category</td>
    <td>
      <ul>
        <li>Category name stored separately into <code>ProductCategories</code></li>
        <li>m:1 product:category relationship</li>
        <li>FK <code>ProductCategories_id</code> in <code>Products</code></li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>Normalize</td>
    <td>rating</td>
    <td>
      <ul>
        <li>rating value stored separately into <code>ProductsRatings</code></li>
        <li>1:m product:rating relationship</li>
        <li>FK <code>Products_id</code> in <code>ProductsRatings</code></li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>Normalize</td>
    <td>quantity</td>
    <td>
      <ul>
        <li>quantity & inventoryStatus values stored separately into <code>ProductsInventory</code></li>
        <li>1:m product:inventory relationship</li>
        <li>FK <code>Products_id</code> in <code>ProductsInventory</code></li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>Normalize</td>
    <td>price</td>
    <td>
      <ul>
        <li>price value stored separately into <code>ProductsPrices</code></li>
        <li>1:m product:price relationship</li>
        <li>FK <code>Products_id</code> in <code>ProductsPrices</code></li>
      </ul>
    </td>
  </tr>
</table>

#### Products Table

| Column | Type | Note |
|-|-|-|
|id|int|autoincrement, primary key|
|code|char 255|unique for deleted=0|
|name|varchar 1024||
|description|varchar 5120||
|image|varchar 2048|optional|
|ProductCategories_id|int|foreign key|
|deleted|tinyint|boolean flag|
|code_filtered_index_workaround|char 255|NULL for deleted=1|

#### Triggers

- Before insert: set `code_filtered_index_workaround` value as `code`.
- Before update: set `code_filtered_index_workaround` value as `code` if `deleted=0` or as `NULL` if `deleted=1`.

### ProductCategories

| Column | Type | Note |
|-|-|-|
|id|int|autoincrement, primary key|
|name|varchar 1024||

### ProductsPrices

Depending on use cases, there may be needs for additional information such as: region, timezone, target group, active flag,…
In this demo, only one price will be applied at a given time, date start defaults to now, any null date end in the system will update to now when a new price is inserted.

| Column | Type | Note |
|-|-|-|
|id|int|autoincrement, primary key|
|Products_id|int|primary key|
|date_start|datetime||
|date_end|datetime||
|price|decimal (8,2)||

### ProductsInventory

Depending on use cases, a transaction id for automatic update or reasons and user fields may be required.
In this demo, only the latest inventory entry is considered, hence keeping track of inventory changes.

| Column | Type | Note |
|-|-|-|
|id|int|autoincrement, primary key|
|Products_id|int|primary key|
|date|datetime||
|quantity|mediumint||
|inventory_status|enum('INSTOCK','LOWSTOCK','OUTOFSTOCK')|set in before insert triggers|

#### Triggers

- Before insert: compute `inventory_status` value based off `quantity`.

### ProductsRatings

Product rating tallies all ratings and provides a rating value.

In the real world, a customer rating table would make more sense, linking a user, a product and a purchase to the rating value. \
A computed value of the rating could be saved to the Products table. Its value updated on rating insert/update or at periodic intervals to simplify loads. \
In this demo, only the latest rating is considered.

| Column | Type | Note |
|-|-|-|
|id|int|autoincrement, primary key|
|Products_id|int|primary key|
|date|datetime||
|rating_count_5|mediumint||
|rating_count_4|mediumint||
|rating_count_3|mediumint||
|rating_count_2|mediumint||
|rating_count_1|mediumint||
|rating|tinyint||

#### Triggers

- Before insert: compute `rating` value based off rating counts.

## Additional tables

These tables are not in use in the demo. \
These tables represent a quick and dirty hack for optional features: user, auth and data history.

### Users

| Column | Type | Note |
|-|-|-|
|id|int|autoincrement, primary key|
|name|varchar 1024||

### Users Authentication

A simplistic old style hash+salt password storage. \
On a serious note, just implement an Oauth library.

| Column | Type | Note |
|-|-|-|
|id|int|autoincrement, primary key|
|Users_id|int|foreign key|
|hash|VARCHAR 512||
|salt|VARCHAR 45||

### Roles

| Column | Type | Note |
|-|-|-|
|id|int|autoincrement, primary key|
|role_name|VARCHAR 1024||
|role_code|VARCHAR 512||

### UsersRoles

| Column | Type | Note |
|-|-|-|
|id|int|autoincrement, primary key|
|Users_id|int|foreign key|
|Roles_id|int|foreign key|

### Data History

A table to store CRUD operations history. \
This draft implementation only stores database changes. \
A more realistic implementation should also track from which user actions CRUD operations originated. 

| Column | Type | Note |
|-|-|-|
|id|int|autoincrement, primary key|
|Users_id|int|foreign key|
|database_table|varchar 1024||
|before|JSON||
|after|JSON||
|timestamp|datetime||

### Stored Procedures

#### New Product

In one transaction:
- Insert to `Products`
- Select LAST_INSERT_ID() as @newid
- Insert to `ProductsPrices`
- Insert to `ProductsInventory`
- Insert to `ProductsRatings`
- Return @newid

#### Update Product

In one transaction:
- Update `Products` if code, name, description, image or category is not null
- If price is not null 
  - Update `ProductsPrices` change all null `date_end` to now() with same `Products_id`
  - Insert to `ProductsPrices` 
- Insert to `ProductsInventory` if quantity is not null

## Files

Source [MySQL Workbench file](../database-model.mwb)

Exported [SQL creation script](../docker-entrypoint-initdb.d/001-database-model.sql)

Exported [SQL model diagram](../database_model.png)

## Initial Database State

A [JS script](../back/database/products-json-to-sql.js) is provided which converts the source `products.json` into a [SQL script](../docker-entrypoint-initdb.d/002-database-state-insert.sql) that inserts its data to the Database model.

# Next

[Tasks](./008-tasks.md)