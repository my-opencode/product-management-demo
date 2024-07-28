import { before, beforeEach, describe, it, mock } from "node:test";
import * as assert from "assert";
import Categories from "./category";
import AppSymbols from "../AppSymbols";

describe(`Category class`, function () {
  let app: any;
  let pool: any;
  beforeEach(function () {
    app.get.mock.resetCalls();
    pool.execute.mock.resetCalls();
  });
  before(function () {
    pool = {
      execute: mock.fn((statement: string) => Promise.resolve([[{ id: 1, name: `a` }, { id: 2, name: `b` }]]))
    };
    app = {
      get: mock.fn((path: string) => pool)
    };
  });
  describe(`list (listFromDatabase alias)`, function () {
    it(`should call app.get`, async function () {
      await Categories.list(app);
      assert.strictEqual(app.get.mock.callCount(), 1);
      assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
    });
    it(`should call pool.execute`, async function () {
      await Categories.list(app);
      assert.strictEqual(pool.execute.mock.callCount(), 1);
      assert.strictEqual(typeof pool.execute.mock.calls[0].arguments[0], `string`);
    });
    it(`should return results`, async function () {
      const result = await Categories.list(app);
      assert.deepStrictEqual(
        result,
        [{ id: 1, name: `a` }, { id: 2, name: `b` }]
      );
    });
  });
  describe(`listFromDatabase`, function () {
    it(`should call app.get`, async function () {
      await Categories.listFromDatabase(app);
      assert.strictEqual(app.get.mock.callCount(), 1);
      assert.strictEqual(app.get.mock.calls[0].arguments[0], AppSymbols.connectionPool);
    });
    it(`should call pool.execute`, async function () {
      await Categories.listFromDatabase(app);
      assert.strictEqual(pool.execute.mock.callCount(), 1);
      assert.strictEqual(typeof pool.execute.mock.calls[0].arguments[0], `string`);
    });
    it(`should return results`, async function () {
      const result = await Categories.listFromDatabase(app);
      assert.deepStrictEqual(
        result,
        [{ id: 1, name: `a` }, { id: 2, name: `b` }]
      );
    });
  });
});