import { before, beforeEach, describe, it, mock } from "node:test";
import * as assert from "assert";
import Product, { ProductAsInTheJson, ProductBase, SQL_CALL_UPDATE_FIELDS_LIST } from "./Products";
import AppSymbols from "../AppSymbols";
import { ValidationError, ValidationErrorStack } from "../lib/validators";
import { QueryError, ResultSetHeader } from "mysql2";
import { getDummyProduct } from "../lib/test-product-util";
import { DirectProductSelectExecuteResponse, NewProductStoredProcedureExecuteResponse, SpNewProductResult } from "../database/adapter-response-format";

describe(`SQL update call statement maker`, function(){
  let p : Product;
  beforeEach(function(){
    p = getDummyProduct({isSaved:true});
  });
  it(`Product is not updated`,function(){
    assert.strictEqual(
      SQL_CALL_UPDATE_FIELDS_LIST(p),
      `CALL update_product(${p.id}, NULL, NULL, NULL, NULL, NULL, NULL, NULL);`
    );
  });
  it(`code to update`,function(){
    p.code = `abcd`;
    assert.strictEqual(
      SQL_CALL_UPDATE_FIELDS_LIST(p),
      `CALL update_product(${p.id}, "abcd", NULL, NULL, NULL, NULL, NULL, NULL);`
    );
  });
  it(`name to update`,function(){
    p.name = `abcd`;
    assert.strictEqual(
      SQL_CALL_UPDATE_FIELDS_LIST(p),
      `CALL update_product(${p.id}, NULL, "abcd", NULL, NULL, NULL, NULL, NULL);`
    );
  });
  it(`desc to update`,function(){
    p.description = `abcd`;
    assert.strictEqual(
      SQL_CALL_UPDATE_FIELDS_LIST(p),
      `CALL update_product(${p.id}, NULL, NULL, "abcd", NULL, NULL, NULL, NULL);`
    );
  });
  it(`image to update`,function(){
    p.image = `abcd`;
    assert.strictEqual(
      SQL_CALL_UPDATE_FIELDS_LIST(p),
      `CALL update_product(${p.id}, NULL, NULL, NULL, "abcd", NULL, NULL, NULL);`
    );
  });
  it(`category to update`,function(){
    p.category = 12;
    assert.strictEqual(
      SQL_CALL_UPDATE_FIELDS_LIST(p),
      `CALL update_product(${p.id}, NULL, NULL, NULL, NULL, 12, NULL, NULL);`
    );
  });
  it(`price to update`,function(){
    p.price = 12.12;
    assert.strictEqual(
      SQL_CALL_UPDATE_FIELDS_LIST(p),
      `CALL update_product(${p.id}, NULL, NULL, NULL, NULL, NULL, 12.12, NULL);`
    );
  });
  it(`quantity to update`,function(){
    p.quantity = 12;
    assert.strictEqual(
      SQL_CALL_UPDATE_FIELDS_LIST(p),
      `CALL update_product(${p.id}, NULL, NULL, NULL, NULL, NULL, NULL, 12);`
    );
  });
});

describe(`Product static - list (listFromDatabase alias)`, function () {
  let app: any;
  let pool: any;
  before(function () {
    const results: ProductBase[] = [
      {
        id: 1,
        categoryId: 2,
        category: ``,
        name: `product 1`,
        code: `abcd0001`,
        description: `this is product 1`,
        quantity: 101,
        price: 15.55,
        rating: 3,
        inventoryStatus: "INSTOCK"
      },
      {
        id: 2,
        categoryId: 3,
        category: ``,
        name: `product 2`,
        code: `abcd0002`,
        description: `this is product 2`,
        quantity: 2,
        price: 999,
        rating: 5,
        inventoryStatus: "LOWSTOCK"
      }];
    pool = {
      execute: mock.fn((statement: string) => Promise.resolve([results]))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  beforeEach(function () {
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get`, async function () {
    await Product.list(app);
    assert.strictEqual(app.get.mock.callCount(), 1);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute`, async function () {
    await Product.list(app);
    assert.strictEqual(pool.execute.mock.callCount(), 1);
    assert.strictEqual(typeof pool.execute.mock.calls[0].arguments[0], `string`);
  });
  it(`should return results`, async function () {
    const result = await Product.list(app);
    // assert.deepStrictEqual(
    //   result,
    //   [{ id: 1 }, { id: 2 }]
    // );
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].id, 1);
    assert.strictEqual(result[1].id, 2);
  });
});

describe(`Product static - listFromDatabase`, function () {
  let app: any;
  let pool: any;
  before(function () {
    const results: ProductBase[] = [
      {
        id: 1,
        categoryId: 2,
        category: ``,
        name: `product 1`,
        code: `abcd0001`,
        description: `this is product 1`,
        quantity: 101,
        price: 15.55,
        rating: 3,
        inventoryStatus: "INSTOCK"
      },
      {
        id: 2,
        categoryId: 3,
        category: ``,
        name: `product 2`,
        code: `abcd0002`,
        description: `this is product 2`,
        quantity: 2,
        price: 999,
        rating: 5,
        inventoryStatus: "LOWSTOCK"
      }];
    pool = {
      execute: mock.fn((statement: string) => Promise.resolve([results]))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  beforeEach(function () {
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get`, async function () {
    await Product.listFromDatabase(app);
    assert.strictEqual(app.get.mock.callCount(), 1);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute`, async function () {
    await Product.listFromDatabase(app);
    assert.strictEqual(pool.execute.mock.callCount(), 1);
    assert.strictEqual(typeof pool.execute.mock.calls[0].arguments[0], `string`);
  });
  it(`should return results`, async function () {
    const result = await Product.listFromDatabase(app);
    // assert.deepStrictEqual(
    //   result,
    //   [{ id: 1 }, { id: 2 }]
    // );
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].id, 1);
    assert.strictEqual(result[1].id, 2);
  });
});

describe(`Product static - getById (getFromDatabaseById alias)`, function () {
  let app: any;
  let pool: any;
  before(function () {
    const results: ProductBase[] = [
      {
        id: 2,
        categoryId: 3,
        category: ``,
        name: `product 2`,
        code: `abcd0002`,
        description: `this is product 2`,
        quantity: 2,
        price: 999,
        rating: 5,
        inventoryStatus: "LOWSTOCK"
      }];
    pool = {
      execute: mock.fn((statement: string) => Promise.resolve([results]))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  beforeEach(function () {
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get`, async function () {
    await Product.getById(app, 1);
    assert.strictEqual(app.get.mock.callCount(), 1);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute`, async function () {
    await Product.getById(app, 1);
    assert.strictEqual(pool.execute.mock.callCount(), 1);
    assert.strictEqual(typeof pool.execute.mock.calls[0].arguments[0], `string`);
  });
  it(`should return a product`, async function () {
    const result = await Product.getById(app, 1);
    // assert.deepStrictEqual(
    //   result,
    //   { id: 1 }
    // );
    assert.ok(result instanceof Product);
    assert.strictEqual(result.id, 2);
  });
});

describe(`Product static - getFromDatabaseById`, function () {
  let app: any;
  let pool: any;
  before(function () {
    const results: ProductBase[] = [
      {
        id: 2,
        categoryId: 3,
        category: ``,
        name: `product 2`,
        code: `abcd0002`,
        description: `this is product 2`,
        quantity: 2,
        price: 999,
        rating: 5,
        inventoryStatus: "LOWSTOCK"
      }];
    pool = {
      execute: mock.fn((statement: string) => Promise.resolve([results]))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  beforeEach(function () {
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get`, async function () {
    await Product.getFromDatabaseById(app, 1);
    assert.strictEqual(app.get.mock.callCount(), 1);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute`, async function () {
    await Product.getFromDatabaseById(app, 1);
    assert.strictEqual(pool.execute.mock.callCount(), 1);
    assert.strictEqual(typeof pool.execute.mock.calls[0].arguments[0], `string`);
  });
  it(`should return results`, async function () {
    const result = await Product.getFromDatabaseById(app, 1);
    assert.ok(result instanceof Product);
    assert.strictEqual(result.id, 2);
  });
});

describe(`Product static - insertNewToDatabase - reject conditions`, function () {
  describe(`Early reject conditions`, function () {
    it(`should reject without product`, async function () {
      await assert.rejects(
        //@ts-ignore
        () => Product.insertNewToDatabase(),
        new Error(`Missing product to save.`)
      )
    });
    it(`should reject on isReadOnly product`, async function () {
      await assert.rejects(
        //@ts-ignore
        () => Product.insertNewToDatabase(undefined, getDummyProduct({ isReadOnly: true })),
        new Error(`Product is read only. Please provide a valid category id.`)
      )
    });
  });
});

describe(`Product static - insertNewToDatabase - Category not found`, function () {
  let app: any;
  let pool: any;
  before(function () {
    const noRowError = new Error(`Value not found in ProductCategories.id for foreign key constraint`) as QueryError;
    noRowError.errno = 1452;
    noRowError.code = `ER_NO_REFERENCED_ROW_2`;
    pool = {
      execute: mock.fn((statement: string) => Promise.reject(noRowError))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  beforeEach(function () {
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get once (save + error)`, async function () {
    const p = getDummyProduct();
    await assert.rejects(Product.insertNewToDatabase(app, p));
    assert.strictEqual(app.get.mock.callCount(), 1);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute once (save + error)`, async function () {
    const p = getDummyProduct();
    await assert.rejects(Product.insertNewToDatabase(app, p));
    assert.strictEqual(pool.execute.mock.callCount(), 1);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0, 17), `CALL new_product(`);
  });
  it(`should throw validation stack`, async function () {
    const p = getDummyProduct();
    await assert.rejects(
      Product.insertNewToDatabase(app, p),
      ValidationErrorStack
    );
  });
});

describe(`Product static - insertNewToDatabase - Duplicate code`, function () {
  let app: any;
  let pool: any;
  before(function () {
    const noRowError = new Error(`Duplicate entry 'f230fh0g3' for key 'Products.code_filtered_index_workaround_UNIQUE'`) as QueryError;
    noRowError.errno = 1062;
    noRowError.code = `ER_DUP_ENTRY`;
    pool = {
      execute: mock.fn((statement: string) => Promise.reject(noRowError))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  beforeEach(function () {
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get once (save + error)`, async function () {
    const p = getDummyProduct();
    await assert.rejects(Product.insertNewToDatabase(app, p));
    assert.strictEqual(app.get.mock.callCount(), 1);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute once (save + error)`, async function () {
    const p = getDummyProduct();
    await assert.rejects(Product.insertNewToDatabase(app, p));
    assert.strictEqual(pool.execute.mock.callCount(), 1);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0, 17), `CALL new_product(`);
  });
  it(`should throw validation stack`, async function () {
    const p = getDummyProduct()
    await assert.rejects(
      Product.insertNewToDatabase(app, p),
      ValidationErrorStack
    );
  });
});

describe(`Product static - insertNewToDatabase - New not found`, function () {
  let app: any;
  let pool: any;
  let p: Product;
    const createResult: NewProductStoredProcedureExecuteResponse = [
      [{id:18} as SpNewProductResult],
      {} as unknown as ResultSetHeader
    ];
    const getByIdResult : DirectProductSelectExecuteResponse = [];
    function* ExecuteResult() {
      yield [createResult];
      yield [getByIdResult];
    }

  beforeEach(function () {    
    const execRes = ExecuteResult();
    pool = {
      execute: mock.fn((statement: string) => Promise.resolve(execRes.next().value))
    };
    app = {
      get: mock.fn((path: string) => {
        console.log(`insertNewToDatabase - New not found - app.get - ${path}`);
        return pool;
      })
    };
    p = new Product({
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      categoryId: 1,
      category: ``,
      quantity: 10,
      price: 100,
      rating: 3
    });
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get twice (save + getById)`, async function () {
    await assert.rejects(Product.insertNewToDatabase(app, p));
    assert.strictEqual(app.get.mock.callCount(), 2);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
    assert.strictEqual(app.get.mock.calls[1].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute twice (save + getById)`, async function () {
    await assert.rejects(Product.insertNewToDatabase(app, p));
    assert.strictEqual(pool.execute.mock.callCount(), 2);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0, 17), `CALL new_product(`);
    assert.strictEqual(pool.execute.mock.calls[1].arguments[0].slice(0, 6), `SELECT`);
  });
  it(`should return product`, async function () {
    await assert.rejects(
      () => Product.insertNewToDatabase(app, p),
      new Error(`Unable to retrieve new product from Database.`)
    );
  });
});

describe(`Product static - insertNewToDatabase`, function () {
  let app: any;
  let pool: any;
  let p: Product;
  const createResult: NewProductStoredProcedureExecuteResponse = [
    [{id:18} as SpNewProductResult],
    {} as unknown as ResultSetHeader
  ];
  const getByIdResult : DirectProductSelectExecuteResponse = [
    {
      id: 18,
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      categoryId: 1,
      category: ``,
      quantity: 10,
      price: 100,
      rating: 3,
      inventoryStatus: "INSTOCK"
    } as ProductAsInTheJson ];
  beforeEach(function () {
    function* ExecuteResult() {
      yield [createResult];
      yield [getByIdResult];
    }
      const execRes = ExecuteResult();
    pool = {
      execute: mock.fn((statement: string) => Promise.resolve(execRes.next().value))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
    p = new Product({
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      categoryId: 1,
      category: ``,
      quantity: 10,
      price: 100,
      rating: 3
    });
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get twice (save + getById)`, async function () {
    await Product.insertNewToDatabase(app, p);
    assert.strictEqual(app.get.mock.callCount(), 2);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute twice (save + getById)`, async function () {
    await Product.insertNewToDatabase(app, p);
    assert.strictEqual(pool.execute.mock.callCount(), 2);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0, 17), `CALL new_product(`);
    assert.strictEqual(pool.execute.mock.calls[1].arguments[0].slice(0, 19), `SELECT 
      p.id,`);
  });
  it(`should return product`, async function () {
    const result = await Product.insertNewToDatabase(app, p);
    assert.ok(result instanceof Product);
  });
  it(`should not update product`, async function () {
    assert.deepStrictEqual(
      p.isSaved,
      false
    );
    await Product.insertNewToDatabase(app, p);
    assert.deepStrictEqual(
      p.isSaved,
      false
    );
  });
});

describe(`Product static - updateInDatabase - reject conditions`, function () {
  describe(`Early reject conditions`, function () {
    it(`should reject without product`, async function () {
      await assert.rejects(
        //@ts-ignore
        () => Product.updateInDatabase(),
        new Error(`Missing product to save.`)
      )
    });
    it(`should reject on isReadOnly product`, async function () {
      await assert.rejects(
        //@ts-ignore
        () => Product.updateInDatabase(undefined, getDummyProduct({ isReadOnly: true })),
        new Error(`Product is read only. Please provide a valid category id.`)
      )
    });
    it(`should reject on unsaved product`, async function () {
      await assert.rejects(
        //@ts-ignore
        () => Product.updateInDatabase(undefined, getDummyProduct()),
        new Error(`Update called on unsaved product.`)
      )
    });
    it(`should reject on product without update`, async function () {
      await assert.rejects(
        //@ts-ignore
        () => Product.updateInDatabase(undefined, getDummyProduct({ isSaved: true })),
        new Error(`Update called on product without updates.`)
      )
    });
  });
});

describe(`Product static - updateInDatabase - Category not found`, function () {
  let app: any;
  let pool: any;
  before(function () {
    const noRowError = new Error(`Value not found in ProductCategories.id for foreign key constraint`) as QueryError;
    noRowError.errno = 1452;
    noRowError.code = `ER_NO_REFERENCED_ROW_2`;
    pool = {
      execute: mock.fn((statement: string) => Promise.reject(noRowError))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  beforeEach(function () {
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get once (save + error)`, async function () {
    const p = getDummyProduct({ isUpdated: true });
    await assert.rejects(Product.updateInDatabase(app, p));
    assert.strictEqual(app.get.mock.callCount(), 1);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute once (save + error)`, async function () {
    const p = getDummyProduct({ isUpdated: true });
    await assert.rejects(Product.updateInDatabase(app, p));
    assert.strictEqual(pool.execute.mock.callCount(), 1);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0, 20), `CALL update_product(`);
  });
  it(`should throw validation stack`, async function () {
    const p = getDummyProduct({ isUpdated: true });
    await assert.rejects(
      Product.updateInDatabase(app, p),
      ValidationErrorStack
    );
  });
});

describe(`Product static - updateInDatabase - Duplicate code`, function () {
  let app: any;
  let pool: any;
  before(function () {
    const noRowError = new Error(`Duplicate entry 'f230fh0g3' for key 'Products.code_filtered_index_workaround_UNIQUE'`) as QueryError;
    noRowError.errno = 1062;
    noRowError.code = `ER_DUP_ENTRY`;
    pool = {
      execute: mock.fn((statement: string) => Promise.reject(noRowError))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  beforeEach(function () {
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get once (save + error)`, async function () {
    const p = getDummyProduct({ isUpdated: true });
    await assert.rejects(Product.updateInDatabase(app, p));
    assert.strictEqual(app.get.mock.callCount(), 1);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute once (save + error)`, async function () {
    const p = getDummyProduct({ isUpdated: true });
    await assert.rejects(Product.updateInDatabase(app, p));
    assert.strictEqual(pool.execute.mock.callCount(), 1);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0, 20), `CALL update_product(`);
  });
  it(`should throw validation stack`, async function () {
    const p = getDummyProduct({ isUpdated: true });
    await assert.rejects(
      Product.updateInDatabase(app, p),
      ValidationErrorStack
    );
  });
});

describe(`Product static - updateInDatabase - Product not found`, function () {
  let app: any;
  let pool: any;
  before(function () {
    const noRowError = new Error(`Could not execute Update event on Table 'Products'; Can't find record in 'Products; Error_code: 1032;'`) as QueryError;
    noRowError.errno = 1032;
    noRowError.code = `ER_KEY_NOT_FOUND`;
    pool = {
      execute: mock.fn((statement: string) => Promise.reject(noRowError))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  beforeEach(function () {
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get once (save + error)`, async function () {
    const p = getDummyProduct({ isUpdated: true });
    await assert.rejects(Product.updateInDatabase(app, p));
    assert.strictEqual(app.get.mock.callCount(), 1);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute once (save + error)`, async function () {
    const p = getDummyProduct({ isUpdated: true });
    await assert.rejects(Product.updateInDatabase(app, p));
    assert.strictEqual(pool.execute.mock.callCount(), 1);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0, 20), `CALL update_product(`);
  });
  it(`should throw validation stack`, async function () {
    const p = getDummyProduct({ isUpdated: true });
    await assert.rejects(
      Product.updateInDatabase(app, p),
      ValidationErrorStack
    );
  });
});

describe(`Product static - updateInDatabase - Updated not found`, function () {
  let app: any;
  let pool: any;
  let p: Product;
  const results: ProductBase[] = [
    {
      id: 18,
      code: `abc`,
      name: `product abc`,
      description: `product abc desc`,
      image: `abc.png`,
      categoryId: 1,
      category: ``,
      quantity: 10,
      price: 100,
      rating: 3,
      inventoryStatus: "INSTOCK"
    }];
  function* ExecuteResult() {
    yield [results];
    yield [];
  }
  beforeEach(function () {
    const execRes = ExecuteResult();
    pool = {
      execute: mock.fn((statement: string) => Promise.resolve(execRes.next().value))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
    p = new Product({
      id: 18,
      code: `a`,
      name: `product a`,
      description: `product a desc`,
      image: `a.png`,
      categoryId: 1,
      category: ``,
      quantity: 10,
      price: 100,
      rating: 3
    });
    p.code = `abc`;
    p.name = `product abc`;
    p.description = `product abc desc`;
    p.image = `a.png`;
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get twice (save + getById)`, async function () {
    await assert.rejects(Product.updateInDatabase(app, p));
    assert.strictEqual(app.get.mock.callCount(), 2);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute twice (save + getById)`, async function () {
    await assert.rejects(Product.updateInDatabase(app, p));
    assert.strictEqual(pool.execute.mock.callCount(), 2);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0, 20), `CALL update_product(`);
    assert.strictEqual(pool.execute.mock.calls[1].arguments[0].slice(0, 19), `SELECT \n      p.id,`);
  });
  it(`should return product`, async function () {
    await assert.rejects(
      () => Product.updateInDatabase(app, p),
      new Error(`Unable to retrieve updated product from Database.`)
    );
  });
});

describe(`Product static - updateInDatabase`, function () {
  let app: any;
  let pool: any;
  let p: Product;
  before(function () {
    const results: ProductBase[] = [
      {
        id: 18,
        code: `abc`,
        name: `product abc`,
        description: `product abc desc`,
        image: `abc.png`,
        categoryId: 1,
        category: ``,
        quantity: 10,
        price: 100,
        rating: 3,
        inventoryStatus: "INSTOCK"
      }];
    pool = {
      execute: mock.fn((statement: string) => Promise.resolve([results]))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  beforeEach(function () {
    p = new Product({
      id: 18,
      code: `a`,
      name: `product a`,
      description: `product a desc`,
      image: `a.png`,
      categoryId: 1,
      category: ``,
      quantity: 10,
      price: 100,
      rating: 3
    });
    p.code = `abc`;
    p.name = `product abc`;
    p.name = `product abc desc`;
    p.image = `a.png`;
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get twice (save + getById)`, async function () {
    await Product.updateInDatabase(app, p);
    assert.strictEqual(app.get.mock.callCount(), 2);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute twice (save + getById)`, async function () {
    await Product.updateInDatabase(app, p);
    assert.strictEqual(pool.execute.mock.callCount(), 2);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0, 20), `CALL update_product(`);
    assert.strictEqual(pool.execute.mock.calls[1].arguments[0].slice(0, 19), `SELECT 
      p.id,`);
  });
  it(`should return product`, async function () {
    const result = await Product.updateInDatabase(app, p);
    assert.ok(result instanceof Product);
  });
  it(`should return updated product`, async function () {
    const result = await Product.updateInDatabase(app, p);
    assert.ok(result instanceof Product);
    assert.deepStrictEqual(
      result.isUpdated,
      false
    );
    assert.strictEqual(result.code, `abc`);
  });
  it(`should not update product`, async function () {
    assert.deepStrictEqual(
      p.isUpdated,
      true
    );
    await Product.updateInDatabase(app, p);
    assert.deepStrictEqual(
      p.isUpdated,
      true
    );
  });
});

describe(`Product static - setDeletedInDatabase - Product not found`, function () {
  let app: any;
  let pool: any;
  before(function () {
    const noRowError = new Error(`Could not execute Update event on Table 'Products'; Can't find record in 'Products; Error_code: 1032;'`) as QueryError;
    noRowError.errno = 1032;
    noRowError.code = `ER_KEY_NOT_FOUND`;
    pool = {
      execute: mock.fn((statement: string) => Promise.reject(noRowError))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  beforeEach(function () {
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get once`, async function () {
    await assert.rejects(Product.setDeletedInDatabase(app, 999));
    assert.strictEqual(app.get.mock.callCount(), 1);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute once`, async function () {
    await assert.rejects(Product.setDeletedInDatabase(app, 999));
    assert.strictEqual(pool.execute.mock.callCount(), 1);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0,31), `UPDATE Products SET deleted = 1`);
  });
  it(`should throw validation stack`, async function () {
    await assert.rejects(
      Product.setDeletedInDatabase(app, 999),
      ValidationErrorStack
    );
  });
});

describe(`Product static - setDeletedInDatabase`, function () {
  let app: any;
  let pool: any;
  let p: Product;
  before(function () {
    const results: any[] = [];
    pool = {
      execute: mock.fn((statement: string) => Promise.resolve([results]))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  beforeEach(function () {
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get once`, async function () {
    await Product.setDeletedInDatabase(app, 1);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute once`, async function () {
    await Product.setDeletedInDatabase(app, 1);
    assert.strictEqual(pool.execute.mock.callCount(), 1);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0,31), `UPDATE Products SET deleted = 1`);
  });
});

describe(`Product class - new Product`, function () {
  describe(`invalid id`, function () {
    it(`should throw`, function () {
      assert.throws(
        () => new Product({ id: (`invalid` as unknown as number) }),
        new ValidationError(`Invalid 'id' value.`, `product.id`)
      );
    });
    it(`should throw stack of validation errors`, function () {
      try {
        new Product({
          // @ts-ignore
          category: Array(1).fill(`not a number nor a string`),
          image: ``.padEnd(2049, "."),
          rating: 6
        });
        assert.fail(`Should throw`);
      } catch (err) {
        assert.ok(err instanceof ValidationErrorStack);
        assert.strictEqual(err.message, `Invalid Product`);
        const expected = [
          new ValidationError(`Too short. Min length: 1.`, `product.code`),
          new ValidationError(`Too short. Min length: 1.`, `product.name`),
          new ValidationError(`Too short. Min length: 1.`, `product.description`),
          new ValidationError(`Too long. Max length: 2048.`, `product.image`),
          new ValidationError(`Invalid 'id' value.`, `product.categoryId`),
          new ValidationError(`Too low. Min value: 0.`, `product.quantity`),
          new ValidationError(`Too low. Min value: 0.01.`, `product.price`),
          new ValidationError(`Too high. Max value: 5.`, `product.rating`),
        ];
        err.forEach((e, i) => {
          assert.strictEqual(e.message, expected[i].message, `Unexpected ${i + 1}th error in stack. "${e.message}" against "${expected[i].message}"`);
          assert.strictEqual(e.fieldName, expected[i].fieldName, `Unexpected ${i + 1}th error in stack. "${e.fieldName}" against "${expected[i].fieldName}"`);
        });
      }
    });
  });
  describe(`unsaved`, function () {
    let p: Product;
    it(`should validate`, function () {
      p = new Product({
        code: `abc`,
        name: `product abc`,
        description: `product desc`,
        image: `abc.png`,
        categoryId: 1,
        category: ``,
        quantity: 10,
        price: 100,
        rating: 3
      });
      assert.ok(true);
    });
    it(`should have isSaved false`, function () {
      assert.strictEqual(p.isSaved, false);
    });
  });
  describe(`saved`, function () {
    let p: Product;
    it(`should validate`, function () {
      p = new Product({
        id: 12,
        code: `abc`,
        name: `product abc`,
        description: `product desc`,
        image: `abc.png`,
        categoryId: 1,
        category: ``,
        quantity: 10,
        price: 100,
        rating: 3,
        inventoryStatus: `INSTOCK`
      });
      assert.ok(true);
    });
    it(`should have isSaved false`, function () {
      assert.strictEqual(p.isSaved, true);
    });
    [
      [`id`, 12],
      [`code`, `abc`],
      [`name`, `product abc`],
      [`description`, `product desc`],
      [`image`, `abc.png`],
      [`categoryId`, 1],
      [`quantity`, 10],
      [`price`, 100],
      [`rating`, 3],
      [`inventoryStatus`, `INSTOCK`],
    ].forEach(
      //@ts-ignore
      ([k, v]) => it(`should have ${k}`, function () { assert.strictEqual(p[k], v); })
    )
  });
});

describe(`Product class - update Product`, function () {
  describe(`unsaved: not updated`, function () {
    let p: Product;
    before(function () {
      p = new Product({
        code: `abc`,
        name: `product abc`,
        description: `product desc`,
        image: `abc.png`,
        categoryId: 1,
        category: ``,
        quantity: 10,
        price: 100,
        rating: 3
      });
    });
    it(`should not be saved`, function () {
      assert.strictEqual(p.isSaved, false);
    });
    it(`should accept value change`, function () {
      p.name = `Bcd`;
      assert.strictEqual(p.name, `Bcd`);
      assert.strictEqual(p._name, `Bcd`);
    });
    it(`should not list field updated`, function () {
      assert.strictEqual(p.updatedFields.has(`name`), false);
    });
    it(`should not have flag updated`, function () {
      assert.strictEqual(p.isUpdated, false);
    });
  });
  describe(`saved: updated`, function () {
    let p: Product;
    before(function () {
      p = new Product({
        id: 3,
        code: `abc`,
        name: `product abc`,
        description: `product desc`,
        image: `abc.png`,
        categoryId: 1,
        category: ``,
        quantity: 10,
        price: 100,
        rating: 3
      });
    });
    it(`should be saved`, function () {
      assert.strictEqual(p.isSaved, true);
    });
    it(`should accept value change`, function () {
      p.name = `Bcd`;
      assert.strictEqual(p.name, `Bcd`);
      assert.strictEqual(p._name, `Bcd`);
    });
    it(`should list field updated`, function () {
      assert.strictEqual(p.updatedFields.has(`name`), true);
    });
    it(`should have flag updated`, function () {
      assert.strictEqual(p.isUpdated, true);
    });
  });
  describe(`saved: not updatable fields`, function () {
    let p: Product;
    before(function () {
      p = new Product({
        id: 3,
        code: `abc`,
        name: `product abc`,
        description: `product desc`,
        image: `abc.png`,
        categoryId: 1,
        category: ``,
        quantity: 10,
        price: 100,
        rating: 3
      });
    });
    it(`should not set updated for categoryName`, function () {
      p.category = `Bcd`;
      assert.strictEqual(p.category, 1);
      assert.strictEqual(p._category, 1);
      assert.strictEqual(p.categoryName, `Bcd`);
      assert.strictEqual(p._categoryName, `Bcd`);
      assert.strictEqual(p.categoryId, 1);
      assert.strictEqual(p.updatedFields.has(`category`), false);
      assert.strictEqual(p.isUpdated, false);
    });
    it(`should not set updated for rating`, function () {
      p.rating = 4;
      assert.strictEqual(p.rating, 4);
      assert.strictEqual(p._rating, 4);
      //@ts-ignore
      assert.strictEqual(p.updatedFields.has(`rating`), false);
      assert.strictEqual(p.isUpdated, false);
    });
    it(`should not set updated for inventoryStatus`, function () {
      p.inventoryStatus = "OUTOFSTOCK";
      assert.strictEqual(p.inventoryStatus, `OUTOFSTOCK`);
      assert.strictEqual(p._inventoryStatus, `OUTOFSTOCK`);
      //@ts-ignore
      assert.strictEqual(p.updatedFields.has(`inventoryStatus`), false);
      assert.strictEqual(p.isUpdated, false);
    });
  });
  describe(`update status - no update conditions`, function(){
    let p:Product;
    before(function(){
      p = new Product({
        id: 1050,
        code: `aaaa`,
        name: `aaaa product`,
        description: `aaaa desc`,
        image: `aaaa.png`,
        categoryId: 1,
        category: "category a",
        quantity: 12,
        price: 12.00,
      });
    });
    it(`should be saved`, function(){
      assert.strictEqual(
        p.isSaved,
        true
      );
    });
    it(`should not update given the same code`, function(){
      assert.strictEqual(p.isUpdated, false);
      p.code = `aaaa`;
      assert.strictEqual(p.isUpdated, false);
      p.code = `  aaaa   `;
      assert.strictEqual(p.isUpdated, false);
    });
    it(`should not update given the same name`, function(){
      assert.strictEqual(p.isUpdated, false);
      p.name = `aaaa product`;
      assert.strictEqual(p.isUpdated, false);
      p.name = `  aaaa product  `;
      assert.strictEqual(p.isUpdated, false);
    });
    it(`should not update given the same description`, function(){
      assert.strictEqual(p.isUpdated, false);
      p.description = `aaaa desc`;
      assert.strictEqual(p.isUpdated, false);
      p.description = `  aaaa desc  `;
      assert.strictEqual(p.isUpdated, false);
    });
    it(`should not update given the same image`, function(){
      assert.strictEqual(p.isUpdated, false);
      p.image = `aaaa.png`;
      assert.strictEqual(p.isUpdated, false);
      p.image = `  aaaa.png  `;
      assert.strictEqual(p.isUpdated, false);
    });
    it(`should not update given the same categoryId`, function(){
      assert.strictEqual(p.isUpdated, false);
      p.categoryId = 1;
      assert.strictEqual(p.isUpdated, false);
    });
    it(`should not update given the same quantity`, function(){
      assert.strictEqual(p.isUpdated, false);
      p.quantity = 12;
      assert.strictEqual(p.isUpdated, false);
    });
    it(`should not update given the same price`, function(){
      assert.strictEqual(p.isUpdated, false);
      p.price = 12.00;
      assert.strictEqual(p.isUpdated, false);
      p.price = 12;
      assert.strictEqual(p.isUpdated, false);
      p.price = "12";
      assert.strictEqual(p.isUpdated, false);
    });
  });
  describe(`update status - update conditions`, function(){
    let p:Product;
    beforeEach(function(){
      p = new Product({
        id: 1050,
        code: `aaaa`,
        name: `aaaa product`,
        description: `aaaa desc`,
        image: `aaaa.png`,
        categoryId: 1,
        category: "category a",
        quantity: 12,
        price: 12.12,
      });
    });
    it(`should update given new code`, function(){
      assert.strictEqual(p.isUpdated, false);
      p.code = `bbbb`;
      assert.strictEqual(p.isUpdated, true);
      assert.strictEqual(p.updatedFields.size, 1);
      assert.strictEqual(p.updatedFields.has(`code`), true);
    });
    it(`should update given new name`, function(){
      assert.strictEqual(p.isUpdated, false);
      p.name = `bbbb product`;
      assert.strictEqual(p.isUpdated, true);
      assert.strictEqual(p.updatedFields.size, 1);
      assert.strictEqual(p.updatedFields.has(`name`), true);
    });
    it(`should update given new description`, function(){
      assert.strictEqual(p.isUpdated, false);
      p.description = `bbbb desc`;
      assert.strictEqual(p.isUpdated, true);
      assert.strictEqual(p.updatedFields.size, 1);
      assert.strictEqual(p.updatedFields.has(`description`), true);
    });
    it(`should update given new image`, function(){
      assert.strictEqual(p.isUpdated, false);
      p.image = `bbbb.png`;
      assert.strictEqual(p.isUpdated, true);
      assert.strictEqual(p.updatedFields.size, 1);
      assert.strictEqual(p.updatedFields.has(`image`), true);
    });
    it(`should update given new categoryId`, function(){
      assert.strictEqual(p.isUpdated, false);
      p.categoryId = 2;
      assert.strictEqual(p.isUpdated, true);
      assert.strictEqual(p.updatedFields.size, 1);
      assert.strictEqual(p.updatedFields.has(`category`), true);
    });
    it(`should update given new quantity`, function(){
      assert.strictEqual(p.isUpdated, false);
      p.quantity = 5;
      assert.strictEqual(p.isUpdated, true);
      assert.strictEqual(p.updatedFields.size, 1);
      assert.strictEqual(p.updatedFields.has(`quantity`), true);
    });
    it(`should update given new price`, function(){
      assert.strictEqual(p.isUpdated, false);
      p.price = 8.95;
      assert.strictEqual(p.isUpdated, true);
      assert.strictEqual(p.updatedFields.size, 1);
      assert.strictEqual(p.updatedFields.has(`price`), true);
    });
  });
});

describe(`Product inst - productFieldUpdateAfterSave`, function () {
  let target = {
    id: 555,
    code: `abcd`,
    name: `efgh`,
    description: `ijkl`,
    image: `mnop.png`,
    quantity: 10000,
    price: 20000,
    rating: 5,
    inventoryStatus: `INSTOCK`,
    categoryId: 4,
    category: "four"
  } as ProductAsInTheJson;
  let p: Product;
  before(function () {
    p = getDummyProduct();
    const p2 = new Product(target);
    p.productFieldUpdateAfterSave(p2);
  });
  Object.entries(target).forEach(([k, v]) =>
    it(`should have updated ${k}`, function () {
      if(k==="category") k = "categoryName";
      //@ts-ignore
      assert.strictEqual(p[k], v);
    })
  );
});

describe(`Product inst - Product.save`, function () {
  let app: any;
  let pool: any;
  let p: Product;
  const createResult: NewProductStoredProcedureExecuteResponse = [
    [{id:18} as SpNewProductResult],
    {} as unknown as ResultSetHeader
  ];
  const getByIdResult : DirectProductSelectExecuteResponse = [
    {
      id: 18,
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      categoryId: 1,
      category: ``,
      quantity: 10,
      price: 100,
      rating: 3,
      inventoryStatus: "INSTOCK"
    } as ProductAsInTheJson ];
  beforeEach(function () {
    function* ExecuteResult() {
      yield [createResult];
      yield [getByIdResult];
    }
      const execRes = ExecuteResult();
    pool = {
      execute: mock.fn((statement: string) => Promise.resolve(execRes.next().value))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
    p = new Product({
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      categoryId: 1,
      category: ``,
      quantity: 10,
      price: 100,
      rating: 3
    });
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get twice (save + getById)`, async function () {
    await p.save(app);
    assert.strictEqual(app.get.mock.callCount(), 2);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute twice (save + getById)`, async function () {
    await p.save(app);
    assert.strictEqual(pool.execute.mock.callCount(), 2);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0, 17), `CALL new_product(`);
    assert.strictEqual(pool.execute.mock.calls[1].arguments[0].slice(0, 19), `SELECT 
      p.id,`);
  });
  it(`should return product`, async function () {
    const result = await p.save(app);
    assert.ok(
      result instanceof Product
    );
  });
  it(`should update product`, async function () {
    assert.deepStrictEqual(
      p.isSaved,
      false
    );
    await p.save(app);
    assert.strictEqual(p.id, 18);
    assert.deepStrictEqual(
      p.isSaved,
      true
    );
  });
});

describe(`Product inst - Product.update`, function () {
  let app: any;
  let pool: any;
  let p: Product;
  before(function () {
    const results: ProductBase[] = [
      {
        id: 18,
        code: `abc`,
        name: `product abc`,
        description: `product abc desc`,
        image: `abc.png`,
        categoryId: 1,
        category: ``,
        quantity: 10,
        price: 100,
        rating: 3,
        inventoryStatus: "INSTOCK"
      }];
    pool = {
      execute: mock.fn((statement: string) => Promise.resolve([results]))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  beforeEach(function () {
    p = new Product({
      id: 18,
      code: `a`,
      name: `product a`,
      description: `product a desc`,
      image: `a.png`,
      categoryId: 1,
      category: ``,
      quantity: 10,
      price: 100,
      rating: 3
    });
    p.code = `abc`;
    p.name = `product abc`;
    p.name = `product abc desc`;
    p.image = `a.png`;
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get twice (save + getById)`, async function () {
    await p.update(app);
    assert.strictEqual(app.get.mock.callCount(), 2);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute twice (save + getById)`, async function () {
    await p.update(app);
    assert.strictEqual(pool.execute.mock.callCount(), 2);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0, 20), `CALL update_product(`);
    assert.strictEqual(pool.execute.mock.calls[1].arguments[0].slice(0, 19), `SELECT 
      p.id,`);
  });
  it(`should return product`, async function () {
    const result = await p.update(app);
    assert.ok(result instanceof Product);
  });
  it(`should return updated product`, async function () {
    const result = await p.update(app);
    assert.ok(result instanceof Product);
    assert.deepStrictEqual(
      result.isUpdated,
      false
    );
    assert.strictEqual(result.code, `abc`);
  });
  it(`should update product`, async function () {
    assert.deepStrictEqual(
      p.isUpdated,
      true
    );
    await p.update(app);
    assert.deepStrictEqual(
      p.isUpdated,
      false
    );
  });
});

describe(`Product inst - Product.delete`, function () {
  let app: any;
  let pool: any;
  let p: Product;
  before(function () {
    const results: any[] = [];
    pool = {
      execute: mock.fn((statement: string) => Promise.resolve([results]))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  beforeEach(function () {
    p = getDummyProduct({isSaved:true});
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get once`, async function () {
    await p.delete(app);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute once`, async function () {
    await p.delete(app);
    assert.strictEqual(pool.execute.mock.callCount(), 1);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0,31), `UPDATE Products SET deleted = 1`);
  });
  it(`should not update product`, async function () {
    assert.deepStrictEqual(
      p.isSaved,
      true
    );
    await p.delete(app);
    assert.deepStrictEqual(
      p.isSaved,
      false
    );
  });
});

describe(`#62 should accept Quantity 0`, function(){
  it(`should accept a product from db with quantity = 0`, function(){
    const value = JSON.parse("{\"id\":1035,\"code\":\"set-quantity-to-zero\",\"name\":\"set-quantity-to-zero\",\"description\":\"tests set-quantity-to-zero\",\"image\":null,\"categoryId\":3,\"category\":\"Clothing\",\"price\":\"10.10\",\"rating\":0,\"quantity\":0,\"inventoryStatus\":\"OUTOFSTOCK\"}");
    assert.strictEqual(value.quantity, 0);
    const p = new Product(value);
    assert.strictEqual(p.quantity, 0);
  });
});