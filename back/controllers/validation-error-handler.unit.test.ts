import { Response, Request, NextFunction } from "express";
import { describe, it, before, mock, Mock } from "node:test";
import * as assert from "node:assert";
import validationErrorHandler from "./validation-error-handler";
import { ValidationError, ValidationErrorStack } from "../lib/validators";


interface MockedResponse extends Omit<Response, "status" | "send"> {
  status: Mock<(code: number) => MockedResponse>;
  send: Mock<(v: any) => MockedResponse>;
}

describe(`Validation Error Handler controller`, function () {
  let response: MockedResponse;
  let nextFn: Mock<NextFunction>;
  const request = {
    method: `GET`,
    url: `/error/validation`
  } as unknown as Request
  before(function () {
    response = {
      set: mock.fn(() => response),
      status: mock.fn((statusCode: number) => response),
      send: mock.fn(() => response)
    } as unknown as MockedResponse;
    nextFn = mock.fn(() => { });
  });
  describe(`Empty Error`, function () {
    before(function () {
      response.headersSent = false;
      response.status.mock.resetCalls();
      response.send.mock.resetCalls();
      nextFn.mock.resetCalls();
      validationErrorHandler(null as unknown as Error, request, response, nextFn);
    });
    it(`should call next without arg`, function () {
      assert.strictEqual(response.status.mock.callCount(), 0);
      assert.strictEqual(response.send.mock.callCount(), 0);
      assert.strictEqual(nextFn.mock.callCount(), 1);
      assert.deepStrictEqual(nextFn.mock.calls[0].arguments, []);
    });
  });
  describe(`Headers Sent`, function () {
    before(function () {
      response.headersSent = true;
      response.status.mock.resetCalls();
      response.send.mock.resetCalls();
      nextFn.mock.resetCalls();
      validationErrorHandler(new Error(`Oops`), request, response, nextFn);
    });
    it(`should call next with error`, function () {
      assert.strictEqual(response.status.mock.callCount(), 0);
      assert.strictEqual(response.send.mock.callCount(), 0);
      assert.strictEqual(nextFn.mock.callCount(), 1);
      assert.deepStrictEqual(nextFn.mock.calls[0].arguments, [new Error(`Oops`)]);
    });
  });
  describe(`Error that is not validation related`, function () {
    before(function () {
      response.headersSent = false;
      response.status.mock.resetCalls();
      response.send.mock.resetCalls();
      nextFn.mock.resetCalls();
      validationErrorHandler(new Error(`Oops`), request, response, nextFn);
    });
    it(`should call next with error`, function () {
      assert.strictEqual(response.status.mock.callCount(), 0);
      assert.strictEqual(response.send.mock.callCount(), 0);
      assert.strictEqual(nextFn.mock.callCount(), 1);
      assert.deepStrictEqual(nextFn.mock.calls[0].arguments, [new Error(`Oops`)]);
    });
  });
  describe(`Validation Error`, function () {
    before(function () {
      response.headersSent = false;
      response.status.mock.resetCalls();
      response.send.mock.resetCalls();
      nextFn.mock.resetCalls();
      validationErrorHandler(new ValidationError(`Oops`), request, response, nextFn);
    });
    it(`should call status with code`, function () {
      assert.strictEqual(response.status.mock.callCount(), 1);
      assert.deepStrictEqual(response.status.mock.calls[0].arguments, [422]);
    });

    it(`should call send`, function () {
      assert.strictEqual(response.send.mock.callCount(), 1);
    });
  });
  describe(`Validation Error Stack`, function () {
    before(function () {
      response.headersSent = false;
      response.status.mock.resetCalls();
      response.send.mock.resetCalls();
      nextFn.mock.resetCalls();
      validationErrorHandler(new ValidationErrorStack([new ValidationError(`Oops`)]), request, response, nextFn);
    });
    it(`should call status with code`, function () {
      assert.strictEqual(response.status.mock.callCount(), 1);
      assert.deepStrictEqual(response.status.mock.calls[0].arguments, [422]);
    });

    it(`should call send`, function () {
      assert.strictEqual(response.send.mock.callCount(), 1);
    });
  });

});