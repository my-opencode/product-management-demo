import { describe, it } from "node:test";
import * as assert from "node:assert";
import productsRouter from "./products";
import productsGetAll from "../controllers/products-get-all";
import productsGetOneById from "../controllers/products-get-one-by-id";
import { RequestHandler } from "express";

describe(`Products router`, function () {
  it(`should return a router function`, function () {
    assert.strictEqual(productsRouter instanceof Function, true);
  });
  it(`with a stack`, function () {
    assert.strictEqual(Array.isArray(productsRouter.stack), true);
  });
  const stack: [string, ["get" | "post" | "patch" | "delete" | "put" | "all", RequestHandler][]][] = [
    [`/:id`, [
      [`get`, productsGetOneById],
    ]],
    [`/`, [
      [`get`, productsGetAll],
    ]]
  ];
  it(`that is not empty`, function () {
    assert.strictEqual(productsRouter.stack.length, stack.length);
  });
  stack.forEach(([url, substack], i) => {
    it(`with ${url}`, function () {
      assert.strictEqual(productsRouter.stack[i]?.route?.path, url);
    });
    substack.forEach(([method, controller]) => {
      it(`with ${method} ${url} controller`, function () {
        assert.strictEqual(productsRouter.stack[i]?.route?.stack?.[0]?.method, method);
        assert.strictEqual(productsRouter.stack[i]?.route?.stack?.[0]?.handle, controller);
      });
    });
  });
});