import assert from "node:assert";
import { describe, it } from "node:test";
import renderer, { convertErrorStackToPayload, convertOneErrorToPayload } from "./422-validation";
import { ValidationError, ValidationErrorStack } from "../lib/validators";

describe(`one validation error conversion`, function () {
  it(`should return json string`, function () {
    assert.deepEqual(
      convertOneErrorToPayload(new ValidationError(`something`, `field`)), 
      {"errors":{"field":"something"},"description":"something"}
    );
  });
});

describe(`validation error stack conversion`, function () {
  it(`should return json string`, function () {
    assert.deepEqual(
      convertErrorStackToPayload(new ValidationErrorStack([new ValidationError(`something`, `field`)], `failed validation`)), 
      {"errors":{"field":"something"},"description":"failed validation"}
    );
  });
});

describe(`422 validation error stack renderer`, function () {
  it(`should return json string`, function () {
    assert.strictEqual(typeof renderer(new ValidationError(`something`, `field`)), `string`);
    assert.strictEqual(renderer(new ValidationError(`something`, `field`)), `{"errors":{"field":"something"},"description":"something"}`);
  });
  it(`should return json string`, function () {
    assert.strictEqual(typeof renderer(new ValidationErrorStack([new ValidationError(`something`, `field`)], `failed validation`)), `string`);
    assert.strictEqual(renderer(new ValidationErrorStack([new ValidationError(`something`, `field`)], `failed validation`)), `{"errors":{"field":"something"},"description":"failed validation"}`);
  });
});