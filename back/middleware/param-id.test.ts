import { after, before, describe, it, mock, Mock } from "node:test";
import Id from "../models/Id";
import { RequestWithId } from "../types";
import { NextFunction } from "express";
import paramValidatorMwId from "./param-id";
import assert from "node:assert";

describe(`App.param: id validation`, function () {
  let request = {
    params: { id: "0" }
  } as unknown as RequestWithId;
  let response = {
    status: mock.fn(() => response),
    send: mock.fn(() => response)
  } as any;
  let next: Mock<NextFunction> = mock.fn(() => { });
  after(function () {
    mock.restoreAll();
  });
  describe(`Validation error`, function () {
    before(function () {
      request.params.id = "-1";
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      paramValidatorMwId(
        request,
        response,
        next,
        request.params.id,
        `id`
      );
    });
    it(`should call res.status 400`, function () {
      assert.strictEqual(response.status.mock.callCount(), 1);
      assert.strictEqual(response.status.mock.calls[0].arguments?.[0], 400);
    });
    it(`should call res.send`, function () {
      assert.strictEqual(response.send.mock.callCount(), 1);
    });
    it(`should not call next`, function () {
      assert.strictEqual(next.mock.callCount(), 0);
    });
  });
  describe(`Valid value`, function () {
    before(function () {
      request.params.id = "1";
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      paramValidatorMwId(
        request,
        response,
        next,
        request.params.id,
        `id`
      );
    });
    it(`should not call res.status`, function () {
      assert.strictEqual(response.status.mock.callCount(), 0);
    });
    it(`should not call res.send`, function () {
      assert.strictEqual(response.send.mock.callCount(), 0);
    });
    it(`should call next`, function () {
      assert.strictEqual(next.mock.callCount(), 1);
    });
    it(`should set request.id & request.params.id`, function () {
      assert.strictEqual(request.params.id, "1");
      assert.strictEqual(request.id, 1);
    });
  });
  describe(`Unexpected error`, function () {
    before(function () {
      Id.validator = mock.fn(() => { throw new Error(`Oops`); });
      response.send.mock.resetCalls();
      response.status.mock.resetCalls();
      next.mock.resetCalls();
      paramValidatorMwId(
        request,
        response,
        next,
        request.params.id,
        `id`
      );
    });
    it(`should not call res.status`, function () {
      assert.strictEqual(response.status.mock.callCount(), 0);
    });
    it(`should not call res.send`, function () {
      assert.strictEqual(response.send.mock.callCount(), 0);
    });
    it(`should call next with err`, function () {
      assert.strictEqual(next.mock.callCount(), 1);
      assert.deepEqual(next.mock.calls[0].arguments?.[0], new Error(`Oops`));
    });
  });
});