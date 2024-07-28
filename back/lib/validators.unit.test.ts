import assert from "node:assert";
import { describe, it } from "node:test";
import { validateFloat, validateInt, validateMediumInt, validateSmallInt, validateString, validateTinyInt, ValidationError, ValidationErrorStack } from "./validators";

describe(`ValidationError class`, function () {
  it(`should allow 1 argument`, function () {
    const e = new ValidationError(`error message`);
    assert.strictEqual(e.message, `error message`);
  });
  it(`should allow 2 arguments`, function () {
    const e = new ValidationError(`error message`, `name of the field`);
    assert.strictEqual(e.fieldName, `name of the field`);
  });
  it(`should allow 3 arguments`, function () {
    const e = new ValidationError(`error message`, `name of the field`, 409);
    assert.strictEqual(e.statusCode, 409);
  });
  it(`should convert to formatted string`, function () {
    const e = String(new ValidationError(`error message`, `name of the field`, 409));
    assert.strictEqual(e, `ValidationError: name of the field: error message`);
  });
});
describe(`ValidationErrorStack class`, function () {
  it(`should only accept arrays of ValidationErrors as first argument (1)`, function () {
    assert.throws(
      //@ts-ignore
      () => new ValidationErrorStack(`not array`)
      , TypeError
    );
  });
  it(`should only accept arrays of ValidationErrors as first argument (2)`, function () {
    assert.throws(
      //@ts-ignore
      () => new ValidationErrorStack([`not error`])
      , TypeError
    );
  });
  it(`should only accept arrays of ValidationErrors as first argument (3)`, function () {
    assert.throws(
      //@ts-ignore
      () => new ValidationErrorStack([new Error(`something`)])
      , TypeError
    );
  });
  it(`should allow 2 arguments`, function () {
    const e = new ValidationErrorStack([new ValidationError(`error message`)],`stack message`);
    assert.strictEqual(e.message, `stack message`);
    assert.strictEqual(e[0].message, `error message`);
  });
  it(`should allow 3 arguments`, function () {
    const e = new ValidationErrorStack([new ValidationError(`error message`)],`stack message`, 444);
    assert.strictEqual(e.statusCode, 444);
  });
  it(`should convert to formatted string`, function () {
    const e = String(new ValidationErrorStack([new ValidationError(`error message`)],`stack message`, 444));
    assert.strictEqual(e, `ValidationErrorStack: stack message; Stack: ValidationError: unknown field: error message`);
  });
});

describe(`validateString`, function () {
  it(`should throw too long`, function () {
    assert.throws(
      () => validateString(`   `, 2),
      new ValidationError(`Too long. Max length: 2.`, `string`)
    );
  });
  it(`should throw too short`, function () {
    assert.throws(
      () => validateString(`  `, undefined, 4),
      new ValidationError(`Too short. Min length: 4.`, `string`)
    );
  });
  it(`should return a string`, function () {
    const result = validateString(`hello`);
    assert.strictEqual(result, `hello`);
  });
  it(`should accept empty string`, function () {
    const result = validateString(``);
    assert.strictEqual(result, ``);
  });
});

describe(`validateFloat`, function () {
  it(`should throw NaN`, function () {
    assert.throws(
      () => validateFloat(`not a number`),
      new ValidationError(`Not an finite float.`, `float`)
    );
  });
  it(`should throw infinite`, function () {
    assert.throws(
      () => validateFloat(Number.POSITIVE_INFINITY),
      new ValidationError(`Not an finite float.`, `float`)
    );
  });
  it(`should throw too high`, function () {
    assert.throws(
      () => validateFloat(100000.1),
      new ValidationError(`Too high. Max value: 99999.99.`, `float`)
    );
  });
  it(`should throw too low`, function () {
    assert.throws(
      () => validateFloat(2, undefined, 2.1),
      new ValidationError(`Too low. Min value: 2.1.`, `float`)
    );
  });
  it(`should return a float`, function () {
    const result = validateFloat(`1.5`);
    assert.strictEqual(result, 1.5);
  });
  it(`should accept 0`, function () {
    const result = validateFloat(0);
    assert.strictEqual(result, 0);
  });
  it(`should accept negative`, function () {
    const result = validateFloat(`-0.5`);
    assert.strictEqual(result, -0.5);
  });
});

describe(`validateInt`, function () {
  it(`should throw NaN`, function () {
    assert.throws(
      () => validateInt(`not a number`),
      new ValidationError(`Not an finite integer.`, `int`)
    );
  });
  it(`should throw infinite`, function () {
    assert.throws(
      () => validateInt(Number.POSITIVE_INFINITY),
      new ValidationError(`Not an finite integer.`, `int`)
    );
  });
  it(`should throw too high`, function () {
    assert.throws(
      () => validateInt(4294967296),
      new ValidationError(`Too high. Max value: 4294967295.`, `int`)
    );
  });
  it(`should throw too low`, function () {
    assert.throws(
      () => validateInt(2, undefined, 3),
      new ValidationError(`Too low. Min value: 3.`, `int`)
    );
  });
  it(`should return an integer`, function () {
    const result = validateInt(`1.5`);
    assert.strictEqual(result, 1);
  });
  it(`should accept 0`, function () {
    const result = validateInt(0);
    assert.strictEqual(result, 0);
  });
  it(`should accept 0 with minValue = 0`, function () {
    const result = validateInt(0, undefined, 0);
    assert.strictEqual(result, 0);
  });
  it(`should accept negative`, function () {
    const result = validateInt(`-5`);
    assert.strictEqual(result, -5);
  });
});

describe(`validateMediumInt`, function () {
  it(`should throw too high`, function () {
    assert.throws(
      () => validateMediumInt(16777216),
      new ValidationError(`Too high. Max value: 16777215.`, `int`)
    );
  });
});

describe(`validateMediumInt`, function () {
  it(`should throw too high`, function () {
    assert.throws(
      () => validateSmallInt(65536),
      new ValidationError(`Too high. Max value: 65535.`, `int`)
    );
  });
});

describe(`validateTinyInt`, function () {
  it(`should throw too high`, function () {
    assert.throws(
      () => validateTinyInt(256),
      new ValidationError(`Too high. Max value: 255.`, `int`)
    );
  });
});
