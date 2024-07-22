import { describe, it } from "node:test";
import * as assert from "node:assert";
import productsRouter from "./products";
import productsGetAll from "../controllers/products-get-all";
import productsGetOneById from "../controllers/products-get-one-by-id";
import { RequestHandler } from "express";
import productsCreate from "../controllers/products-post-create";
import jsonBodyParser from "../lib/jsonBodyParser";

describe(`Products router`, function () {
  it(`should return a router function`, function () {
    assert.strictEqual(productsRouter instanceof Function, true);
  });
  it(`with a stack`, function () {
    assert.strictEqual(Array.isArray(productsRouter.stack), true);
  });
  const stack: [string, ["get" | "post" | "patch" | "delete" | "put" | "all", RequestHandler[]][]][] = [
    [`/:id`, [
      [`get`, [productsGetOneById]],
    ]],
    [`/`, [
      [`get`, [productsGetAll]],
    ]],
    [`/`, [
      [`post`, [jsonBodyParser,productsCreate]],
    ]]
  ];
  it(`that is not empty`, function () {
    assert.strictEqual(productsRouter.stack.length, stack.length);
  });
  stack.forEach(([url, substack], i) => {
    it(`with ${url}`, function () {
      assert.strictEqual(productsRouter.stack[i]?.route?.path, url);
    });
    substack.forEach(([method, controllers]) => {
      it(`with ${method} ${url} controller`, function () {
        assert.strictEqual(productsRouter.stack[i]?.route?.stack?.[0]?.method, method);
        controllers.forEach((controller,j) => 
          assert.deepEqual(productsRouter.stack[i]?.route?.stack?.[j]?.handle, controller)
        )
      });
    });
  });
});