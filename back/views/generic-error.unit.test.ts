import assert from "node:assert";
import { describe, it } from "node:test";
import renderer from "./generic-error";

describe(`Generic error renderer`, function () {
  it(`should return json string`, function () {
    assert.strictEqual(
      typeof renderer(new Error(`Oops`)),
      `string`
    );
    assert.strictEqual(
      renderer(new Error(`Oops`)),
      `{"description":"Oops"}`
    );
  });
});