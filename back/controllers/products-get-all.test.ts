import { describe, it, before, beforeEach, after, mock, Mock } from "node:test";
import Product from "../models/Products";
import { ProductAsInTheJson } from "../models/Products";
import { RichApp } from "../types";
type ListFromDatabase = (app: RichApp) => Promise<ProductAsInTheJson[]>;
import productsGetAll from "./products-get-all";
import * as assert from "node:assert";
import { Request, RequestHandler } from "express";

describe(`Products get all controller`, function () {
  let response: any;
  let next: any;
  beforeEach(function () {
    response.send.mock.resetCalls();
    response.status.mock.resetCalls();
    next.mock.resetCalls();
  });
  after(function () {
    mock.restoreAll();
  });

  describe(`No error`, function () {
    let mockedProductListFromDb: any;

    before(function () {
      const mockResult = [{ id: 1 } as unknown as ProductAsInTheJson];
      Product.listFromDatabase = mock.fn(() => Promise.resolve(mockResult));
      mockedProductListFromDb = Product.listFromDatabase as Mock<ListFromDatabase>;
      response = {
        status: mock.fn((statusCode: number) => response),
        send: mock.fn(() => response)
      };
      assert.strictEqual(response.status.mock.callCount(), 0);
      assert.strictEqual(response.send.mock.callCount(), 0);
      next = mock.fn(() => { });
      assert.strictEqual(next.mock.callCount(), 0);
      assert.strictEqual(mockedProductListFromDb.mock.callCount(), 0);
    });
    it(`should call Product.listFromDatabase`, async function () {
      await productsGetAll({} as unknown as Request, response, next).finally(() => {
        assert.strictEqual(mockedProductListFromDb.mock.callCount(), 1);
        assert.strictEqual(next.mock.callCount(), 0);
      });
      // await productsGetAll({} as unknown as Request, response, next);
    });

    it(`should call response.status`, async function () {
      await productsGetAll({} as unknown as Request, response, next).finally(() => {
        assert.strictEqual(response.status.mock.callCount(), 1);
        assert.strictEqual(next.mock.callCount(), 0);
      });
      // await productsGetAll({} as unknown as Request, response, next);
    });
    it(`should call response.send`, async function () {
      await productsGetAll({} as unknown as Request, response, next).finally(() => {
        assert.strictEqual(response.send.mock.callCount(), 1)
        assert.strictEqual(next.mock.callCount(), 0)
      });
      // await productsGetAll({} as unknown as Request, response, next)
    });
  });

  describe(`With error`, function () {
    let mockedProductListFromDb: any;

    before(function () {
      Product.listFromDatabase = mock.fn(() => Promise.reject(`Oops`));
      mockedProductListFromDb = Product.listFromDatabase as Mock<ListFromDatabase>;
      response = {
        status: mock.fn((statusCode: number) => response),
        send: mock.fn(() => response)
      };
      assert.strictEqual(response.status.mock.callCount(), 0);
      assert.strictEqual(response.send.mock.callCount(), 0);
      next = mock.fn(() => { });
      assert.strictEqual(next.mock.callCount(), 0);
      assert.strictEqual(mockedProductListFromDb.mock.callCount(), 0);
    });
    it(`should call next`, async function () {
      await productsGetAll({} as unknown as Request, response, next).finally(() => {
        assert.strictEqual(mockedProductListFromDb.mock.callCount(), 1)
        assert.strictEqual(response.status.mock.callCount(), 0)
        assert.strictEqual(response.send.mock.callCount(), 0)
        assert.strictEqual(next.mock.callCount(), 1)
      });
      // await productsGetAll({} as unknown as Request, response, next)
    });
  });

});