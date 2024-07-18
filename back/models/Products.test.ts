import { before, beforeEach, describe, it, mock } from "node:test";
import * as assert from "assert";
import Product from "./Products";
import AppSymbols from "../AppSymbols";
import { ValidationError } from "../lib/validators";

describe(`Product class`, function () {
  let app: any;
  let pool: any;
  beforeEach(function () {
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  before(function () {
    pool = {
      execute: mock.fn((statement: string) => Promise.resolve([[{ id: 1 }, { id: 2 }]]))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  describe(`list (listFromDatabase alias)`, function () {
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
      assert.deepStrictEqual(
        result,
        [{ id: 1 }, { id: 2 }]
      );
    });
  });
  describe(`listFromDatabase`, function () {
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
      assert.deepStrictEqual(
        result,
        [{ id: 1 }, { id: 2 }]
      );
    });
  });
  describe(`getById (getFromDatabaseById alias)`, function () {
    it(`should call app.get`, async function () {
      await Product.getById(app, 1);
      assert.strictEqual(app.get.mock.callCount(), 1);
      assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
    });
    it(`should call pool.execute`, async function () {
      await Product.getById(app,1);
      assert.strictEqual(pool.execute.mock.callCount(), 1);
      assert.strictEqual(typeof pool.execute.mock.calls[0].arguments[0], `string`);
    });
    it(`should return results`, async function () {
      const result = await Product.getById(app, 1);
      assert.deepStrictEqual(
        result,
        { id: 1 }
      );
    });
  });
  describe(`getFromDatabaseById`, function () {
    it(`should call app.get`, async function () {
      await Product.getFromDatabaseById(app, 1);
      assert.strictEqual(app.get.mock.callCount(), 1);
      assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
    });
    it(`should call pool.execute`, async function () {
      await Product.getFromDatabaseById(app,1);
      assert.strictEqual(pool.execute.mock.callCount(), 1);
      assert.strictEqual(typeof pool.execute.mock.calls[0].arguments[0], `string`);
    });
    it(`should return results`, async function () {
      const result = await Product.getFromDatabaseById(app, 1);
      assert.deepStrictEqual(
        result,
        { id: 1 }
      );
    });
  });
  describe(`new Product`, function(){
    describe(`invalid id`, function(){
      it(`should throw`, function(){
        assert.throws(
          ()=>new Product({ id: (`invalid` as unknown as number)}),
          new TypeError(`Invalid 'id' value.`)
        );
      });
    });
    describe(`invalid values`, function(){
      it(`should throw`, function(){
        assert.throws(
          ()=>new Product({
            image: ``.padEnd(2049,"."),
            rating: 6
          }),
          new ValidationError(`Invalid Product: ${
            [
              `code: Too short. Min length: 1.`,
              `name: Too short. Min length: 1.`,
              `description: Too short. Min length: 1.`,
              `image: Too long. Max length: 2048.`,
              `category: Invalid foreign id key.`,
              `quantity: Too low. Min value: 0.`,
              `price: Too low. Min value: 0.01.`,
              `rating: Too high. Max value: 5.`,
            ].join(`; `)
          }`)
        );
      });
    });
    describe(`unsaved`, function(){
      let p:Product;
      it(`should validate`, function(){
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
      it(`should have isSaved false`, function(){
        assert.strictEqual(p.isSaved, false);
      });
    });
    describe(`saved`, function(){
      let p:Product;
      it(`should validate`, function(){
        p = new Product({
          id: 12,
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
      it(`should have isSaved false`, function(){
        assert.strictEqual(p.isSaved, true);
      });
    });
  });
  describe(`Product.save`, function () {
    let p:Product;
    before(function () {
      pool = {
        execute: mock.fn(() => Promise.resolve([[{ id: 18 }]]))
      };
      app = {
        get: mock.fn(() => pool)
      };
    });
    beforeEach(function(){
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
    it(`should call app.get`, async function () {
      await p.save(app);
      assert.strictEqual(app.get.mock.callCount(), 1);
      assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
    });
    it(`should call pool.execute`, async function () {
      await p.save(app);
      assert.strictEqual(pool.execute.mock.callCount(), 1);
      assert.strictEqual(typeof pool.execute.mock.calls[0].arguments[0], `string`);
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
});