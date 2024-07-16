import { RequestHandler, Express } from "express";
import { describe, it, before, mock } from "node:test";
import * as assert from "node:assert";
import default404 from "../controllers/default.404";
import setRoutes from "./router";
import errorHandler from "../controllers/errorHandler";

describe(`Router routes setter`, function () {
  let app: any;
  before(function () {
    app = {
      use: mock.fn((...handlers: RequestHandler[]) => { })
    };
    assert.strictEqual(app.use.mock.callCount(), 0);
    setRoutes(app as unknown as Express);
  });
  it(`should call app.use for each sub route`, function () {
    assert.strictEqual(app.use.mock.callCount(), 3);
  });
  it(`should add products routes`, function () {
    const call = app.use.mock.calls[0];
    assert.strictEqual(call.arguments?.[0], `/products`);
  });
  it(`should add use error route`, function () {
    const call = app.use.mock.calls[1];
    assert.deepStrictEqual(call.arguments, [errorHandler]);
  });
  it(`should add use 404 route`, function () {
    const call = app.use.mock.calls[2];
    assert.deepStrictEqual(call.arguments, [default404]);
  });
});