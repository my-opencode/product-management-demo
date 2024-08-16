import { describe, it, before, beforeEach, after, mock, Mock } from "node:test";
import Product from "../models/product";
import { ProductAsInTheJson } from "../models/product.types";
import { RichApp } from "../types";
type ListFromDatabase = (app: RichApp) => Promise<ProductAsInTheJson[]>;
import productsGetAll from "./products-get-all";
import * as assert from "node:assert";
import { Request } from "express";

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
      Product.list = mock.fn(() => Promise.resolve(mockResult));
      mockedProductListFromDb = Product.list as Mock<ListFromDatabase>;
      response = {
        status: mock.fn((statusCode: number) => response),
        send: mock.fn(() => response),
        set: mock.fn(() => response),
      };
      assert.strictEqual(response.status.mock.callCount(), 0);
      assert.strictEqual(response.send.mock.callCount(), 0);
      next = mock.fn(() => { });
      assert.strictEqual(next.mock.callCount(), 0);
      assert.strictEqual(mockedProductListFromDb.mock.callCount(), 0);
    });
    it(`should call Product.list`, async function () {
      await productsGetAll({} as unknown as Request, response, next).finally(() => {
        assert.strictEqual(mockedProductListFromDb.mock.callCount(), 1);
        assert.strictEqual(next.mock.callCount(), 0);
      });
    });

    it(`should call response.status`, async function () {
      await productsGetAll({} as unknown as Request, response, next).finally(() => {
        assert.strictEqual(response.status.mock.callCount(), 1);
        assert.strictEqual(next.mock.callCount(), 0);
      });
    });
    it(`should call response.send`, async function () {
      await productsGetAll({} as unknown as Request, response, next).finally(() => {
        assert.strictEqual(response.send.mock.callCount(), 1);
        assert.strictEqual(next.mock.callCount(), 0);
        assert.strictEqual(response.send.mock.calls[0].arguments[0], `{"data":[{"id":1,"rating":0}]}`);
      });
    });
  });

  describe(`With error`, function () {
    let mockedProductListFromDb: any;

    before(function () {
      Product.list = mock.fn(() => Promise.reject(`Oops`));
      mockedProductListFromDb = Product.list as Mock<ListFromDatabase>;
      response = {
        status: mock.fn((statusCode: number) => response),
        send: mock.fn(() => response),
        set: mock.fn(() => response),
      };
      assert.strictEqual(response.status.mock.callCount(), 0);
      assert.strictEqual(response.send.mock.callCount(), 0);
      next = mock.fn(() => { });
      assert.strictEqual(next.mock.callCount(), 0);
      assert.strictEqual(mockedProductListFromDb.mock.callCount(), 0);
    });
    it(`should call next`, async function () {
      await productsGetAll({} as unknown as Request, response, next).finally(() => {
        assert.strictEqual(mockedProductListFromDb.mock.callCount(), 1);
        assert.strictEqual(response.status.mock.callCount(), 0);
        assert.strictEqual(response.send.mock.callCount(), 0);
        assert.strictEqual(next.mock.callCount(), 1);
      });
    });
  });

});