import { Application } from "express";
import { before, describe, it, Mock, mock } from "node:test";
import setCors from "./cors";
import assert from "node:assert";

describe(`CORS setter`,function(){
  const app = {
    options: mock.fn(()=>{}),
    use: mock.fn(()=>{})
  } as unknown as Application;
  before(function(){
    setCors(app);
  });
  it(`should call app.options`, function(){
    assert.strictEqual(
      (app.options as Mock<any>).mock.callCount(),
      1
    );
  });
  it(`should call app.use`, function(){
    assert.strictEqual(
      (app.use as Mock<any>).mock.callCount(),
      1
    );
  });
});