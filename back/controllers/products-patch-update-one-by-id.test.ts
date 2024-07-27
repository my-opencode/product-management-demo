import { describe, it, before, after, mock, Mock } from "node:test";
import { RequestWithProduct } from "../types";
import * as assert from "node:assert";
import { NextFunction, Request } from "express";
import Product from "../models/Products";
import productsUpdateOneById from "./products-patch-update-one-by-id";
import { getDummyProduct } from "../lib/test-product-util";
import { ValidationError, ValidationErrorStack } from "../lib/validators";

describe(`Products update one by id controller`, function () {
  let request = {
    id: 1,
    params: { id: "1" }
  } as unknown as RequestWithProduct;
  let response = {
    send: mock.fn(() => response),
    set: mock.fn(() => response),
    status: mock.fn(() => response),
  } as any;
  let next: Mock<NextFunction> = mock.fn(() => { });
  after(function () {
    mock.restoreAll();
  });
  describe(`Not found`, function () {
    before(async function () {
      // update request
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsUpdateOneById(request as unknown as RequestWithProduct, response, next);
    });
    it(`should call response.status 404`, function () {
      assert.strictEqual(response.status.mock.callCount(), 1);
      assert.strictEqual(response.status.mock.calls[0]?.arguments?.[0], 404);
    });
  });
  describe(`No change body`, function () {
    before(async function () {
      // update request
      request.product = getDummyProduct({ isSaved: true });
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsUpdateOneById(request, response, next);
    });
    it(`should call next with ValidationError`, function () {
      assert.strictEqual(next.mock.callCount(), 1);
      //@ts-ignore
      assert.ok(next.mock.calls[0].arguments[0] instanceof ValidationError);
    });
  });
  describe(`Validation error`, function () {
    before(function () {
      Product.updateInDatabase = mock.fn(() => Promise.reject(new Error(`Should not be called`)));
      // update request
      request.product = getDummyProduct({isSaved:true});
      request.body = {
        image: ``.padEnd(2049, ".")
      };
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
    });
    it(`should call next with ValidationErrorStack`, async function () {
      await productsUpdateOneById(request as unknown as Request, response, next);
      assert.strictEqual(next.mock.callCount(), 1);
      //@ts-ignore
      assert.ok(next.mock.calls[0].arguments[0] instanceof ValidationErrorStack);
      assert.strictEqual(
        String(next.mock.calls[0].arguments[0]),
        `ValidationErrorStack: Invalid Changes; Stack: ValidationError: product.image: Too long. Max length: 2048.`
      );
    });
  });
  describe(`Expect Change error`, function () {
    before(async function () {
      Product.updateInDatabase = mock.fn(() => {
        throw new Error(`Do not call me`);
      });
      // update request
      request.product = getDummyProduct({ isSaved: true, isUpdated:false });
      request.body = {
        rating: 4
      };
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsUpdateOneById(request as unknown as Request, response, next);
    });
    it(`should call next with error`, function () {
      assert.strictEqual(next.mock.callCount(), 1);
      assert.strictEqual((next.mock.calls[0]?.arguments?.[0] as any)?.message, `Expected changes.`);
    });
  });
  describe(`Unexpected error`, function () {
    before(async function () {
      Product.updateInDatabase = mock.fn(() => {
        throw new Error(`Oops`);
      });
      // update request
      request.product = getDummyProduct({ isSaved: true });
      request.body = {
        code: `abcd`
      };
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsUpdateOneById(request as unknown as Request, response, next);
    });
    it(`should call next with error`, function () {
      assert.strictEqual(next.mock.callCount(), 1);
      assert.strictEqual((next.mock.calls[0]?.arguments?.[0] as any)?.message, `Oops`);
    });
  });
  describe(`Updated`, function () {
    before(async function () {
      request.product = getDummyProduct({isSaved:true});
      Product.updateInDatabase = mock.fn(() => Promise.resolve(new Product({
        id: request.product!.id,
        categoryId: 4,
        code: `a`,
        name: `a`,
        description: `a`,
        image:`a.png`,
        quantity: 10000,
        price: 10000.1,
        inventoryStatus: "INSTOCK"
      })));
      // 
      // update request
      request.body = {
        categoryId: 4,
        code: `a`,
        name: `a`,
        description: `a`,
        image: `a.png`,
        quantity: 10000,
        price: 10000.1,
      };
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsUpdateOneById(request, response, next);
    });
    it(`should call response.status 200`, function () {
      assert.strictEqual(response.status.mock.callCount(), 1);
      assert.strictEqual(response.status.mock.calls[0]?.arguments?.[0], 200);
    });
    it(`should call response.send with payload`, function () {
      assert.strictEqual(response.send.mock.callCount(), 1);
      assert.strictEqual(
        response.send.mock.calls[0]?.arguments?.[0], 
        `{"data":{"id":${request.product!.id},"code":"a","name":"a","category":4,"categoryId":4,"description":"a","image":"a.png","quantity":10000,"inventoryStatus":"INSTOCK","price":10000.1}}`
      );
    });
  });
});