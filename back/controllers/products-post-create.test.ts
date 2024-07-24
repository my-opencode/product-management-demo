import { describe, it, before, after, mock, Mock } from "node:test";
import { RequestWithProduct } from "../types";
import * as assert from "node:assert";
import { NextFunction, Request } from "express";
import Product from "../models/Products";
import productsCreate from "./products-post-create";
import { ValidationErrorStack } from "../lib/validators";

describe(`Products create controller`, function () {
  let request = {
    body: {
      code: `abc`,
      name: `product abc`,
      description: `product desc`,
      image: `abc.png`,
      categoryId: 1,
      quantity: 10,
      price: 100,
      rating: 3
    }
  } as unknown as Request;
  let response = {
    send: mock.fn(() => response),
    set: mock.fn(() => response),
    status: mock.fn(() => response),
  } as any;
  let next: Mock<NextFunction> = mock.fn(() => { });
  after(function () {
    mock.restoreAll();
  });
  describe(`Validation error`, function () {
    before(function () {
      Product.insertNewToDatabase = mock.fn(() => Promise.reject(new Error(`Should not be called`)));
      // update request
      request.body = {
        image: ``.padEnd(2049, "."),
        rating: 6
      };
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
    });
    it(`should call next with ValidationErrorStack`, async function () {
      await  productsCreate(request as unknown as Request, response, next);
      assert.strictEqual(next.mock.callCount(),1);
      //@ts-ignore
      assert.ok(next.mock.calls[0].arguments[0] instanceof ValidationErrorStack);
    });
  });
  describe(`Unexpected error`, function () {
    before(async function () {
      Product.insertNewToDatabase = mock.fn(() => {
        throw new Error(`Oops`);
      });
      // update request
      request.body = {
        code: `abc`,
        name: `product abc`,
        description: `product desc`,
        image: `abc.png`,
        categoryId: 1,
        quantity: 10,
        price: 100,
        rating: 3
      };
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsCreate(request as unknown as Request, response, next);
    });
    it(`should call next with error`, function () {
      assert.strictEqual(next.mock.callCount(), 1);
      assert.strictEqual((next.mock.calls[0]?.arguments?.[0] as any)?.message, `Oops`);
    });
  });
  describe(`Created`, function () {
    before(async function () {
      Product.insertNewToDatabase = mock.fn(() => Promise.resolve(new Product({
        id: 20,
        categoryId: 2,
        code: `a`,
        name: `a`,
        description: `a`,
        quantity: 10,
        price: 10.1,
        inventoryStatus: "INSTOCK"
      })));
      // update request
      request.body = {
        category: 2,
        code: `a`,
        name: `a`,
        description: `a`,
        quantity: 10,
        price: 10.1,
      };
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsCreate(request, response, next);
    });
    it(`should call response.status 200`, function () {
      assert.strictEqual(response.status.mock.callCount(), 1);
      assert.strictEqual(response.status.mock.calls[0]?.arguments?.[0], 201);
    });
    it(`should call response.send with payload`, function () {
      assert.strictEqual(response.send.mock.callCount(), 1);
      assert.strictEqual(response.send.mock.calls[0]?.arguments?.[0], `{"data":{"id":20,"code":"a","name":"a","category":2,"categoryId":2,"description":"a","quantity":10,"inventoryStatus":"INSTOCK","price":10.1}}`);
    });
  });
});