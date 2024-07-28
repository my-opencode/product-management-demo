import { describe, it, before, after, mock, Mock } from "node:test";
import { RequestWithProduct } from "../types";
import * as assert from "node:assert";
import { NextFunction, Request } from "express";
import productsGetOneById from "./products-get-one-by-id";
import Product from "../models/product";

describe(`Products get one by id controller`, function () {
  let request = {
    id: 1,
    params: {id:"1"}
  } as unknown as RequestWithProduct;
  let response = {
    send: mock.fn(() => response),
    set: mock.fn(() => response),
    status: mock.fn(() => response),
  } as any;
  let next: Mock<NextFunction> = mock.fn(()=>{});
  after(function () {
    mock.restoreAll();
  });
  describe(`Not found`, function (){
    before(async function () {
      // update request
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsGetOneById(request as unknown as RequestWithProduct,response,next);
    });
    it(`should call response.status 404`,function(){
      assert.strictEqual(response.status.mock.callCount(),1);
      assert.strictEqual(response.status.mock.calls[0]?.arguments?.[0], 404);
    });
  });
  describe(`Found`, function (){
    before(async function () {
      // update request
      request.product = 
      new Product(
        {id:1,name:`a`,code:`a`,description:`a`,quantity:1,price:10, categoryId:2}
      )
      ;
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsGetOneById(request,response,next);
    });
    it(`should call response.status 200`,function(){
      assert.strictEqual(response.status.mock.callCount(),1);
      assert.strictEqual(response.status.mock.calls[0]?.arguments?.[0], 200);
    });
    it(`should call response.send with payload`,function(){
      assert.strictEqual(response.send.mock.callCount(),1);
      assert.strictEqual(response.send.mock.calls[0]?.arguments?.[0], `{"data":{"id":1,"code":"a","name":"a","category":2,"categoryId":2,"description":"a","quantity":1,"price":10}}`);
    });
  });
});