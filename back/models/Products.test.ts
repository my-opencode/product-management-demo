import { before, beforeEach, describe, it, mock } from "node:test";
import * as assert from "assert";
import Product from "./Products";

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
  describe(`listFromDatabase`, function () {
    it(`should call app.get`, async function () {
      await Product.listFromDatabase(app);
      assert.strictEqual(app.get.mock.callCount(), 1);
      assert.strictEqual(app.get.mock.calls[0].arguments[0], `poolConnection`);
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
  })
});