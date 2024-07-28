import { describe, it, before, after, mock, Mock } from "node:test";
import { RequestWithProduct } from "../types";
import * as assert from "node:assert";
import { NextFunction, Request } from "express";
import Product from "../models/product";
import { getDummyProduct } from "../lib/test-product-util";
import productsDeleteOneById from "./products-delete-one-by-id";

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
      Product.setDeletedInDatabase = mock.fn(() => {
        throw new Error(`Do not call me!`);
      });
      // update request
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsDeleteOneById(request as unknown as RequestWithProduct, response, next);
    });
    it(`should call response.status 404`, function () {
      assert.strictEqual(response.status.mock.callCount(), 1);
      assert.strictEqual(response.status.mock.calls[0]?.arguments?.[0], 404);
    });
  });
  describe(`Unexpected error`, function () {
    before(async function () {
      Product.setDeletedInDatabase = mock.fn(() => {
        throw new Error(`Oops`);
      });
      // update request
      request.product = getDummyProduct({ isSaved: true });
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsDeleteOneById(request as unknown as Request, response, next);
    });
    it(`should call next with error`, function () {
      assert.strictEqual(next.mock.callCount(), 1);
      assert.strictEqual((next.mock.calls[0]?.arguments?.[0] as any)?.message, `Oops`);
    });
  });
  describe(`Deleted`, function () {
    before(async function () {
      request.product = getDummyProduct({isSaved:true});
      Product.setDeletedInDatabase = mock.fn(() => Promise.resolve());
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsDeleteOneById(request, response, next);
    });
    it(`should update product`, function () {
      assert.strictEqual(request.product?.isSaved, false);
    });
    it(`should call response.status 204`, function () {
      assert.strictEqual(response.status.mock.callCount(), 1);
      assert.strictEqual(response.status.mock.calls[0]?.arguments?.[0], 204);
    });
    it(`should call response.send`, function () {
      assert.strictEqual(response.send.mock.callCount(), 1);
    });
  });
});