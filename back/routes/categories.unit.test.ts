import { describe, it } from "node:test";
import * as assert from "node:assert";
import categoriesRouter from "./categories";
import categoriesGetAll from "../controllers/categories-get-all";

describe(`Products router`, function () {
  it(`should return a router function`, function () {
    assert.strictEqual(categoriesRouter instanceof Function, true);
  });
  it(`with a stack`, function () {
    assert.strictEqual(Array.isArray(categoriesRouter.stack), true);
  });
  it(`that is not empty`, function () {
    assert.strictEqual(categoriesRouter.stack.length, 1);
  });
  it(`with a / route`, function () {
    assert.strictEqual(categoriesRouter.stack[0]?.route?.path, `/`);
  });
  it(`whose get handle is categories get all controller`, function () {
    assert.strictEqual(categoriesRouter.stack[0]?.route?.stack?.[0]?.method, `get`);
    assert.strictEqual(categoriesRouter.stack[0]?.route?.stack?.[0]?.handle, categoriesGetAll);
  });
});