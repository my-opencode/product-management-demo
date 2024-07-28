import { Response, Request, NextFunction } from "express";
import { describe, it, before, mock, beforeEach, Mock } from "node:test";
import * as assert from "node:assert";
import errorHandler from "./error-handler";

interface MockedResponse extends Omit<Response, "status" | "send"> {
  status: Mock<(code: number) => MockedResponse>;
  send: Mock<(v: any) => MockedResponse>;
}

describe(`Error Handler controller`, function () {
  let response: MockedResponse;
  let nextFn: Mock<NextFunction>;
  const request = {
    method: `GET`,
    url: `/error/central`
  } as unknown as Request
  before(function () {
    response = {
      status: mock.fn((statusCode: number) => response),
      send: mock.fn(() => response)
    } as unknown as MockedResponse;
    nextFn = mock.fn(() => { });
  });
  describe(`Headers Sent`, function () {
    before(function () {
      response.headersSent = true;
      response.status.mock.resetCalls();
      response.send.mock.resetCalls();
      nextFn.mock.resetCalls();
      errorHandler(new Error(`Oops`), request, response, nextFn);
    });
    it(`should call next with error`, function () {
      assert.strictEqual(response.status.mock.callCount(), 0);
      assert.strictEqual(response.send.mock.callCount(), 0);
      assert.strictEqual(nextFn.mock.callCount(), 1);
      assert.deepStrictEqual(nextFn.mock.calls[0].arguments, [new Error(`Oops`)]);
    });
  });
  describe(`Empty Error`, function () {
    before(function () {
      response.headersSent = false;
      response.status.mock.resetCalls();
      response.send.mock.resetCalls();
      nextFn.mock.resetCalls();
      errorHandler(null as unknown as Error, request, response, nextFn);
    });
    it(`should call next without arg`, function () {
      assert.strictEqual(response.status.mock.callCount(), 0);
      assert.strictEqual(response.send.mock.callCount(), 0);
      assert.strictEqual(nextFn.mock.callCount(), 1);
      assert.deepStrictEqual(nextFn.mock.calls[0].arguments, []);
    });
  });
  describe(`Error`, function () {
    before(function () {
      response.headersSent = false;
      response.status.mock.resetCalls();
      response.send.mock.resetCalls();
      nextFn.mock.resetCalls();
      errorHandler(new Error(`Oops`), request, response, nextFn);
    });
    it(`should call status with code`, function () {
      assert.strictEqual(response.status.mock.callCount(), 1);
      assert.deepStrictEqual(response.status.mock.calls[0].arguments, [500]);
    });

    it(`should call send`, function () {
      assert.strictEqual(response.send.mock.callCount(), 1);
    });
  });



});