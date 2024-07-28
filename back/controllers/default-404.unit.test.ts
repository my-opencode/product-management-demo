import { Response, Request } from "express";
import { describe, it, before, mock } from "node:test";
import * as assert from "node:assert";
import default404 from "./default-404";

describe(`Default 404 controller`, function(){
  let response:any;
  before(function(){
    response = {
      status: mock.fn((statusCode:number)=>response),
      send: mock.fn(()=>response)
    };
    assert.strictEqual(response.status.mock.callCount(), 0);
    assert.strictEqual(response.send.mock.callCount(), 0);
    default404({} as unknown as Request, response as unknown as Response);
  });
  
  it(`should call status with code`, function(){
    assert.strictEqual(response.status.mock.callCount(), 1);
    assert.deepStrictEqual(response.status.mock.calls[0].arguments, [404]);
  });

  it(`should call send`, function(){
    assert.strictEqual(response.send.mock.callCount(), 1);
  });
});