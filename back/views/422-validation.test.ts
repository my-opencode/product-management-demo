import assert from "node:assert";
import { describe, it } from "node:test";
import renderer, { renderErrorStack, renderOneError } from "./422-validation";
import { ValidationError, ValidationErrorStack } from "../lib/validators";

describe(`one validation error render`, function () {
  it(`should return json string`, function () {
    assert.strictEqual(typeof renderOneError(new ValidationError(`something`, `field`)), `string`);
    assert.strictEqual(renderOneError(new ValidationError(`something`, `field`)), `{"errors":{"field":"something"}}`);
  });
});

describe(`validation error stack render`, function () {
  it(`should return json string`, function () {
    assert.strictEqual(typeof renderErrorStack(new ValidationErrorStack([new ValidationError(`something`, `field`)], `failed validation`)), `string`);
    assert.strictEqual(renderErrorStack(new ValidationErrorStack([new ValidationError(`something`, `field`)], `failed validation`)), `{"errors":{"field":"something"},"description":"failed validation"}`);
  });
});

describe(`422 validation error stack renderer`, function () {
  it(`should return json string`, function () {
    assert.strictEqual(typeof renderer(new ValidationError(`something`, `field`)), `string`);
    assert.strictEqual(renderer(new ValidationError(`something`, `field`)), `{"errors":{"field":"something"}}`);
  });
  it(`should return json string`, function () {
    assert.strictEqual(typeof renderer(new ValidationErrorStack([new ValidationError(`something`, `field`)], `failed validation`)), `string`);
    assert.strictEqual(renderer(new ValidationErrorStack([new ValidationError(`something`, `field`)], `failed validation`)), `{"errors":{"field":"something"},"description":"failed validation"}`);
  });
});