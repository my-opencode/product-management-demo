import { RequestHandler, Express } from "express";
import { describe, it, before, mock } from "node:test";
import * as assert from "node:assert";
import productsGetAll from "../controllers/products-get-all";
import default404 from "../controllers/default.404";
import setRoutes from "./router";

describe(`Router routes setter`, function(){
  let app:any;
  before(function(){
    app = {
      get: mock.fn((path:string,...handlers:RequestHandler[])=>{}),
      use: mock.fn((...handlers:RequestHandler[])=>{})
    };
    assert.strictEqual(app.get.mock.callCount(), 0);
    assert.strictEqual(app.use.mock.callCount(), 0);
    setRoutes(app as unknown as Express);
  });
  
  it(`should add GET /products route`, function(){
    assert.strictEqual(app.get.mock.callCount(), 1);
    const call = app.get.mock.calls[0];
    assert.deepStrictEqual(call.arguments, [`/products/`, productsGetAll]);
  });
  it(`should add use 404 route`, function(){
    assert.strictEqual(app.use.mock.callCount(), 1);
    const call = app.use.mock.calls[0];
    assert.deepStrictEqual(call.arguments, [default404]);
  });
});