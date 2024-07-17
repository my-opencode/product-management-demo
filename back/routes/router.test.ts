// import { RequestHandler, Express } from "express";
// import { describe, it, before, mock } from "node:test";
// import * as assert from "node:assert";
// import default404 from "../controllers/default.404";
// import setRoutes from "./router";
// import errorHandler from "../controllers/errorHandler";

import { RequestHandler, Router } from "express";
import { describe, it } from "node:test";
import * as assert from "node:assert";
import router from "./router";
import categoriesGetAll from "../controllers/categories-get-all";
import productsGetAll from "../controllers/products-get-all";
import productsGetOneById from "../controllers/products-get-one-by-id";
import errorHandler from "../controllers/errorHandler";
import default404 from "../controllers/default.404";


describe(`Router`, function () {
  it(`should return a router function`, function () {
    assert.strictEqual(router instanceof Function, true);
  });
  it(`with a stack`, function () {
    assert.ok(Array.isArray(router.stack));
  });
  it(`of layers`, function(){
    assert.strictEqual(router.stack.length, 4);
  });
  it(`categories layer`, function(){
    assert.ok(router.stack[0].regexp.toString().includes(`categories`));
    assert.strictEqual((router.stack[0].handle as Router).stack.length, 1);
  });
  it(`products layer`, function(){
    assert.ok(router.stack[1].regexp.toString().includes(`products`));
    assert.strictEqual((router.stack[1].handle as Router).stack.length, 2);
  });
  it(`with id parameters`, function(){
    //@ts-ignore
    assert.strictEqual((router.stack[1].handle as Router).params.id.length, 2);
  });
  it(`errorHandler layer`, function(){
    assert.strictEqual(router.stack[2].name, `errorHandler`);
  });
  it(`default404 layer`, function(){
    assert.strictEqual(router.stack[3].name, `default404`);
  });

  // const stack: [string, ["get" | "post" | "patch" | "delete" | "put" | "all", RequestHandler][]][] = [
  //   [`/:id`, [
  //     [`get`, productsGetOneById],
  //   ]],
  //   [`/`, [
  //     [`get`, productsGetAll],
  //   ]]
  // ];
  // it(`that is not empty`, function () {
  //   assert.strictEqual(router.stack.length, stack.length);
  // });
  // stack.forEach(([url, substack], i) => {
  //   it(`with ${url}`, function () {
  //     assert.strictEqual(router.stack[i]?.route?.path, url);
  //   });
  //   substack.forEach(([method, controller]) => {
  //     it(`with ${method} ${url} controller`, function () {
  //       assert.strictEqual(router.stack[i]?.route?.stack?.[0]?.method, method);
  //       assert.strictEqual(router.stack[i]?.route?.stack?.[0]?.handle, controller);
  //     });
  //   });
  // });
});

// describe(`Router routes setter`, function () {
//   let app: any;
//   before(function () {
//     app = {
//       use: mock.fn((...handlers: RequestHandler[]) => { })
//     };
//     assert.strictEqual(app.use.mock.callCount(), 0);
//     setRoutes(app as unknown as Express);
//   });
//   it(`should call app.use for each sub route`, function () {
//     assert.strictEqual(app.use.mock.callCount(), 4);
//   });
//   it(`should add products routes`, function () {
//     const call = app.use.mock.calls[0];
//     assert.strictEqual(call.arguments?.[0], `/categories`);
//   });
//   it(`should add products routes`, function () {
//     const call = app.use.mock.calls[1];
//     assert.strictEqual(call.arguments?.[0], `/products`);
//   });
//   it(`should add use error route`, function () {
//     const call = app.use.mock.calls[2];
//     assert.deepStrictEqual(call.arguments, [errorHandler]);
//   });
//   it(`should add use 404 route`, function () {
//     const call = app.use.mock.calls[3];
//     assert.deepStrictEqual(call.arguments, [default404]);
//   });
// });