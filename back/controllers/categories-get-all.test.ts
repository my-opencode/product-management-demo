import { describe, it, before, beforeEach, after, mock, Mock } from "node:test";
import Category from "../models/Categories";
import { CategoryFromDb } from "../models/Categories";
import { RichApp } from "../types";
type ListFromDatabase = (app: RichApp) => Promise<CategoryFromDb[]>;
import categoriesGetAll from "./categories-get-all";
import * as assert from "node:assert";
import { Request, RequestHandler } from "express";

describe(`Categories get all controller`, function () {
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
      const mockResult = [{ id: 1, name: `a` } as CategoryFromDb];
      Category.list = mock.fn(() => Promise.resolve(mockResult));
      mockedProductListFromDb = Category.list as Mock<ListFromDatabase>;
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
    it(`should call Category.list`, async function () {
      await categoriesGetAll({} as unknown as Request, response, next).finally(() => {
        assert.strictEqual(mockedProductListFromDb.mock.callCount(), 1);
        assert.strictEqual(next.mock.callCount(), 0);
      });
      // await categoriesGetAll({} as unknown as Request, response, next);
    });

    it(`should call response.status`, async function () {
      await categoriesGetAll({} as unknown as Request, response, next).finally(() => {
        assert.strictEqual(response.status.mock.callCount(), 1);
        assert.strictEqual(next.mock.callCount(), 0);
      });
      // await categoriesGetAll({} as unknown as Request, response, next);
    });
    it(`should call response.send`, async function () {
      await categoriesGetAll({} as unknown as Request, response, next).finally(() => {
        assert.strictEqual(response.send.mock.callCount(), 1)
        assert.strictEqual(next.mock.callCount(), 0)
      });
      // await categoriesGetAll({} as unknown as Request, response, next)
    });
  });

  describe(`With error`, function () {
    let mockedProductListFromDb: any;

    before(function () {
      Category.list = mock.fn(() => Promise.reject(`Oops`));
      mockedProductListFromDb = Category.list as Mock<ListFromDatabase>;
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
      await categoriesGetAll({} as unknown as Request, response, next).finally(() => {
        assert.strictEqual(mockedProductListFromDb.mock.callCount(), 1)
        assert.strictEqual(response.status.mock.callCount(), 0)
        assert.strictEqual(response.send.mock.callCount(), 0)
        assert.strictEqual(next.mock.callCount(), 1)
      });
      // await categoriesGetAll({} as unknown as Request, response, next)
    });
  });

});