import assert from "node:assert";
import { describe, it } from "node:test";
import { validateFloat, validateInt, validateMediumInt, validateSmallInt, validateString, validateTinyInt, ValidationError } from "./validators";

describe(`validateString`, function(){
  it(`should throw too long`, function(){
    assert.throws(
      ()=>validateString(`   `,2),
      new ValidationError(`Too long. Max length: 2.`)
    );
  });
  it(`should throw too short`, function(){
    assert.throws(
      ()=>validateString(`  `,undefined,4),
      new ValidationError(`Too short. Min length: 4.`)
    );
  });
  it(`should return a string`, function(){
    const result = validateString(`hello`);
    assert.strictEqual(result, `hello`);
  });
  it(`should accept empty string`, function(){
    const result = validateString(``);
    assert.strictEqual(result, ``);
  });
});

describe(`validateFloat`, function(){
  it(`should throw NaN`, function(){
    assert.throws(
      ()=>validateFloat(`not a number`),
      new ValidationError(`Not an finite float.`)
    );
  });
  it(`should throw infinite`, function(){
    assert.throws(
      ()=>validateFloat(Number.POSITIVE_INFINITY),
      new ValidationError(`Not an finite float.`)
    );
  });
  it(`should throw too high`, function(){
    assert.throws(
      ()=>validateFloat(100000.1),
      new ValidationError(`Too high. Max value: 99999.99.`)
    );
  });
  it(`should throw too low`, function(){
    assert.throws(
      ()=>validateFloat(2,undefined,2.1),
      new ValidationError(`Too low. Min value: 2.1.`)
    );
  });
  it(`should return a float`, function(){
    const result = validateFloat(`1.5`);
    assert.strictEqual(result, 1.5);
  });
  it(`should accept 0`, function(){
    const result = validateFloat(0);
    assert.strictEqual(result, 0);
  });
  it(`should accept negative`, function(){
    const result = validateFloat(`-0.5`);
    assert.strictEqual(result, -0.5);
  });
});

describe(`validateInt`, function(){
  it(`should throw NaN`, function(){
    assert.throws(
      ()=>validateInt(`not a number`),
      new ValidationError(`Not an finite integer.`)
    );
  });
  it(`should throw infinite`, function(){
    assert.throws(
      ()=>validateInt(Number.POSITIVE_INFINITY),
      new ValidationError(`Not an finite integer.`)
    );
  });
  it(`should throw too high`, function(){
    assert.throws(
      ()=>validateInt(4294967296),
      new ValidationError(`Too high. Max value: 4294967295.`)
    );
  });
  it(`should throw too low`, function(){
    assert.throws(
      ()=>validateInt(2,undefined,3),
      new ValidationError(`Too low. Min value: 3.`)
    );
  });
  it(`should return an integer`, function(){
    const result = validateInt(`1.5`);
    assert.strictEqual(result, 1);
  });
  it(`should accept 0`, function(){
    const result = validateInt(0);
    assert.strictEqual(result, 0);
  });
  it(`should accept negative`, function(){
    const result = validateInt(`-5`);
    assert.strictEqual(result, -5);
  });
});
<<<<<<< HEAD
=======

describe(`validateMediumInt`, function(){
  it(`should throw too high`, function(){
    assert.throws(
      ()=>validateMediumInt(16777216),
      new ValidationError(`Too high. Max value: 16777215.`)
    );
  });
});

describe(`validateMediumInt`, function(){
  it(`should throw too high`, function(){
    assert.throws(
      ()=>validateSmallInt(65536),
      new ValidationError(`Too high. Max value: 65535.`)
    );
  });
});

describe(`validateMediumInt`, function(){
  it(`should throw too high`, function(){
    assert.throws(
      ()=>validateTinyInt(256),
      new ValidationError(`Too high. Max value: 255.`)
    );
  });
});
>>>>>>> 94f0b04 (generic validators)
