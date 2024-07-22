import { describe, before, it, mock, Mock, after } from "node:test";
import { RequestWithProduct } from "../types";
import { NextFunction } from "express";
import productsParamMwGetProductById from "./products-param-id";
import assert from "node:assert";
import Product, { ProductAsInTheJson } from "../models/Products";
import { ValidationError } from "../lib/validators";

describe(`Products Id param middleware`, function () {
  let response = {
    send: mock.fn(() => response),
    set: mock.fn(() => response),
    status: mock.fn(() => response),
  } as any;
  let next: Mock<NextFunction> = mock.fn(() => { });
  after(function () {
    mock.restoreAll();
  });
  describe(`Missing req.id`, async function () {
    let request = {
      id: undefined,
      params: { id: undefined }
    } as unknown as RequestWithProduct;
    before(async function () {
      Product.getById = mock.fn(() => Promise.reject(new Error(`Don't call me.`)));
      // update request
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsParamMwGetProductById(
        request as any,
        response,
        next,
        1,
        `id`);
    });
    it(`should call next with error`, function () {
      assert.strictEqual(next.mock.callCount(), 1);
      // console.log(next.mock.calls[0]?.arguments?.[0])
      assert.ok ((next.mock.calls[0]?.arguments?.[0] as any) instanceof ValidationError);
    });
  });
  describe(`Not found`, async function () {
    let request = {
      id: 1,
      params: { id: "1" }
    } as unknown as RequestWithProduct;
    before(async function () {
      Product.getById = mock.fn(() => Promise.resolve(undefined));
      // update request
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsParamMwGetProductById(
        request as any,
        response,
        next,
        1,
        `id`);
    });
    it(`should call response.status 404`, function () {
      assert.strictEqual(response.status.mock.callCount(), 1);
      assert.strictEqual(response.status.mock.calls[0]?.arguments?.[0], 404);
    });
  });
  describe(`Found`, async function () {
    let request = {
      id: 1,
      params: { id: "1" }
    } as unknown as RequestWithProduct;
    before(async function () {
      Product.getById = mock.fn(() => Promise.resolve({ id: 1 } as Product));
      // update request
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsParamMwGetProductById(
        request as any,
        response,
        next,
        1,
        `id`);
    });
    it(`should call next without error`, function () {
      assert.strictEqual(next.mock.callCount(), 1);
      assert.strictEqual(next.mock.calls[0]?.arguments?.length, 0);
    });
  });

  describe(`Unexpected Error`, async function () {
    let request = {
      id: 1,
      params: { id: "1" }
    } as unknown as RequestWithProduct;
    before(async function () {
      Product.getById = mock.fn(() => Promise.reject(new Error(`Oops`)));
      // update request
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      // call controller
      await productsParamMwGetProductById(
        request as any,
        response,
        next,
        1,
        `id`);
    });
    it(`should call next with error`, function () {
      assert.strictEqual(next.mock.callCount(), 1);
      assert.deepEqual(next.mock.calls[0]?.arguments?.[0], new Error(`Oops`));
    });
  });
});