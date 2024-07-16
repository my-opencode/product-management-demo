import { RequestHandler, Express } from "express";
import { describe, it, mock } from "node:test";
import * as assert from "node:assert";
import setProductsRoutes from "./products";
import productsGetAll from "../controllers/products-get-all";

describe(`Products routes setter`, function(){
  it(`should add GET /products route`, function(){
    const app = {
      get: mock.fn((path:string,...handlers:RequestHandler[])=>{})
    };
    assert.strictEqual(app.get.mock.callCount(), 0);
    setProductsRoutes(app as unknown as Express);
    assert.strictEqual(app.get.mock.callCount(), 1);
    const call = app.get.mock.calls[0];
    assert.deepStrictEqual(call.arguments, [`/products/`, productsGetAll]);
  });
});