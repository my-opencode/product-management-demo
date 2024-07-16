import express, { RequestHandler, Express, Router } from "express";
import { describe, it, mock } from "node:test";
import * as assert from "node:assert";
import productsRouter from "./products";
import productsGetAll from "../controllers/products-get-all";

describe(`Products router`, function () {
  it(`should return a router function`, function () {
    assert.strictEqual(productsRouter instanceof Function, true);
  });
  it(`with a stack`, function () {
    assert.strictEqual(Array.isArray(productsRouter.stack), true);
  });
  it(`that is not empty`, function () {
    assert.strictEqual(productsRouter.stack.length, 1);
  });
  it(`with a / route`, function () {
    assert.strictEqual(productsRouter.stack[0]?.route?.path, `/`);
  });
  it(`whose get handle is products get all controller`, function () {
    assert.strictEqual(productsRouter.stack[0]?.route?.stack?.[0]?.method, `get`);
    assert.strictEqual(productsRouter.stack[0]?.route?.stack?.[0]?.handle, productsGetAll);
  });
});