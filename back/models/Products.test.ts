import { before, beforeEach, describe, it, mock } from "node:test";
import * as assert from "assert";
import Product, { ProductAsInTheJson, ProductBase } from "./Products";
import AppSymbols from "../AppSymbols";
import { ValidationError, ValidationErrorStack } from "../lib/validators";
import { QueryError } from "mysql2";

describe(`Product static - list (listFromDatabase alias)`, function () {
  let app: any;
  let pool: any;
  before(function () {
    const results: ProductBase[] = [
      {
        id: 1,
        category: 2,
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
        category: 3,
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
        category: 2,
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
        category: 3,
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
        category: 3,
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
        category: 3,
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
          new ValidationError(`Invalid 'id' value.`, `product.category`),
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
        category: 1,
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
        category: 1,
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
      [`id`,12],
      [`code`,`abc`],
      [`name`,`product abc`],
      [`description`,`product desc`],
      [`image`,`abc.png`],
      [`category`,1],
      [`quantity`,10],
      [`price`,100],
      [`rating`,3],
      [`inventoryStatus`,`INSTOCK`],
    ].forEach(
      //@ts-ignore
      ([k,v]) => it(`should have ${k}`, function () { assert.strictEqual(p[k], v); })
    )
  });
});

describe(`Product class - update Product`, function () {
  describe(`unsaved: not updated`, function () {
    let p:Product;
    before(function(){
      p = new Product({
        code: `abc`,
        name: `product abc`,
        description: `product desc`,
        image: `abc.png`,
        category: 1,
        quantity: 10,
        price: 100,
        rating: 3
      });
    });
    it(`should not be saved`, function(){
      assert.strictEqual(p.isSaved,false);
    });
    it(`should accept value change`, function(){
      p.name = `Bcd`;
      assert.strictEqual(p.name,`Bcd`);
      assert.strictEqual(p._name,`Bcd`);
    });
    it(`should not list field updated`, function(){
      assert.strictEqual(p.updatedFields.has(`name`),false);
    });
    it(`should not have flag updated`, function(){
      assert.strictEqual(p.isUpdated,false);
    });
  });
  describe(`saved: updated`, function () {
    let p:Product;
    before(function(){
      p = new Product({
        id: 3,
        code: `abc`,
        name: `product abc`,
        description: `product desc`,
        image: `abc.png`,
        category: 1,
        quantity: 10,
        price: 100,
        rating: 3
      });
    });
    it(`should be saved`, function(){
      assert.strictEqual(p.isSaved,true);
    });
    it(`should accept value change`, function(){
      p.name = `Bcd`;
      assert.strictEqual(p.name,`Bcd`);
      assert.strictEqual(p._name,`Bcd`);
    });
    it(`should list field updated`, function(){
      assert.strictEqual(p.updatedFields.has(`name`),true);
    });
    it(`should have flag updated`, function(){
      assert.strictEqual(p.isUpdated,true);
    });
  });
  describe(`saved: not updatable fields`, function () {
    let p:Product;
    before(function(){
      p = new Product({
        id: 3,
        code: `abc`,
        name: `product abc`,
        description: `product desc`,
        image: `abc.png`,
        category: 1,
        quantity: 10,
        price: 100,
        rating: 3
      });
    });
    it(`should not set updated for categoryName`, function(){
      p.category = `Bcd`;
      assert.strictEqual(p.category,1);
      assert.strictEqual(p._category,1);
      assert.strictEqual(p.categoryName,`Bcd`);
      assert.strictEqual(p._categoryName,`Bcd`);
      assert.strictEqual(p.categoryId,1);
      assert.strictEqual(p.updatedFields.has(`category`),false);
      assert.strictEqual(p.isUpdated,false);
    });
    it(`should not set updated for rating`, function(){
      p.rating = 4;
      assert.strictEqual(p.rating,4);
      assert.strictEqual(p._rating,4);
      //@ts-ignore
      assert.strictEqual(p.updatedFields.has(`rating`),false);
      assert.strictEqual(p.isUpdated,false);
    });
    it(`should not set updated for inventoryStatus`, function(){
      p.inventoryStatus = "OUTOFSTOCK";
      assert.strictEqual(p.inventoryStatus,`OUTOFSTOCK`);
      assert.strictEqual(p._inventoryStatus,`OUTOFSTOCK`);
      //@ts-ignore
      assert.strictEqual(p.updatedFields.has(`inventoryStatus`),false);
      assert.strictEqual(p.isUpdated,false);
    });
  });
});

describe(`Product inst - Product.save - Referenced row not found`, function () {
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
    const p = new Product({
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      category: 1,
      quantity: 10,
      price: 100,
      rating: 3
    });
    await assert.rejects(p.save(app));
    assert.strictEqual(app.get.mock.callCount(), 1);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute once (save + error)`, async function () {
    const p = new Product({
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      category: 1,
      quantity: 10,
      price: 100,
      rating: 3
    });
    await assert.rejects(p.save(app));
    assert.strictEqual(pool.execute.mock.callCount(), 1);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0, 17), `CALL new_product(`);
  });
  it(`should throw validation stack`, async function () {
    const p = new Product({
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      category: 1,
      quantity: 10,
      price: 100,
      rating: 3
    });
    await assert.rejects(
      p.save(app),
      ValidationErrorStack
    );
  });
});

describe(`Product inst - Product.save - Duplicate code`, function () {
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
    const p = new Product({
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      category: 1,
      quantity: 10,
      price: 100,
      rating: 3
    });
    await assert.rejects(p.save(app));
    assert.strictEqual(app.get.mock.callCount(), 1);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute once (save + error)`, async function () {
    const p = new Product({
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      category: 1,
      quantity: 10,
      price: 100,
      rating: 3
    });
    await assert.rejects(p.save(app));
    assert.strictEqual(pool.execute.mock.callCount(), 1);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0, 17), `CALL new_product(`);
  });
  it(`should throw validation stack`, async function () {
    const p = new Product({
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      category: 1,
      quantity: 10,
      price: 100,
      rating: 3
    });
    await assert.rejects(
      p.save(app),
      ValidationErrorStack
    );
  });
});

describe(`Product inst - Product.save`, function () {
  let app: any;
  let pool: any;
  before(function () {
    const results: ProductBase[] = [
      {
        id: 18,
        code: `abc`,
        name: `product abc`,
        description: `product desc`,
        image: `abc.png`,
        category: 1,
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
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  it(`should call app.get twice (save + getById)`, async function () {
    const p = new Product({
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      category: 1,
      quantity: 10,
      price: 100,
      rating: 3
    });
    await p.save(app);
    assert.strictEqual(app.get.mock.callCount(), 2);
    assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
  });
  it(`should call pool.execute twice (save + getById)`, async function () {
    const p = new Product({
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      category: 1,
      quantity: 10,
      price: 100,
      rating: 3
    });
    await p.save(app);
    assert.strictEqual(pool.execute.mock.callCount(), 2);
    assert.strictEqual(pool.execute.mock.calls[0].arguments[0].slice(0, 17), `CALL new_product(`);
    assert.strictEqual(pool.execute.mock.calls[1].arguments[0].slice(0, 19), `SELECT 
      p.id,`);
  });
  it(`should return product`, async function () {
    const p = new Product({
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      category: 1,
      quantity: 10,
      price: 100,
      rating: 3
    });
    const result = await p.save(app);
    assert.ok(
      result instanceof Product
    );
  });
  it(`should update product`, async function () {
    const p = new Product({
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      category: 1,
      quantity: 10,
      price: 100,
      rating: 3
    });
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