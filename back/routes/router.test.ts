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


describe(`Router`, function () {
  it(`should return a router function`, function () {
    assert.strictEqual(router instanceof Function, true);
  });
  it(`with a stack`, function () {
    assert.ok(Array.isArray(router.stack));
  });
  it(`of layers`, function(){
    assert.strictEqual(router.stack.length, 5);
  });
  it(`categories layer`, function(){
    assert.ok(router.stack[0].regexp.toString().includes(`categories`));
    assert.strictEqual((router.stack[0].handle as Router).stack.length, 1);
  });
  it(`products layer`, function(){
    assert.ok(router.stack[1].regexp.toString().includes(`products`));
    assert.strictEqual((router.stack[1].handle as Router).stack.length, 5);
  });
  it(`with id parameters`, function(){
    //@ts-ignore
    assert.strictEqual((router.stack[1].handle as Router).params.id.length, 2);
  });
  it(`validationErrorHandler layer`, function(){
    assert.strictEqual(router.stack[2].name, `validationErrorHandler`);
  });
  it(`errorHandler layer`, function(){
    assert.strictEqual(router.stack[3].name, `errorHandler`);
  });
  it(`default404 layer`, function(){
    assert.strictEqual(router.stack[4].name, `default404`);
  });
});