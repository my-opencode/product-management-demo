import { before, beforeEach, describe, it, mock } from "node:test";
import * as assert from "assert";
import Product from "./Products";
import AppSymbols from "../AppSymbols";

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
});