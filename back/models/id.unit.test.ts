import assert from "node:assert";
import { describe, it } from "node:test";
import Id from "./id";
import { ValidationError } from "../lib/validators";

describe(`Id class`, function(){
  describe(`Static validator`, function(){
    it(`should throw on NaN`, function(){
      assert.throws(
        ()=>Id.validator("not a number"),
        ValidationError
      );
    });
    it(`should throw with custom error message`, function(){
      assert.throws(
        ()=>Id.validator("not a number", "That's not an id!"),
        new ValidationError(`That's not an id!`, `id`)
      );
    });
    it(`should throw on infinity`, function(){
      assert.throws(
        ()=>Id.validator(Number.POSITIVE_INFINITY),
        ValidationError
      );
    });
    it(`should throw on zero`, function(){
      assert.throws(
        ()=>Id.validator(0),
        ValidationError
      );
    });
    it(`should throw on negative`, function(){
      assert.throws(
        ()=>Id.validator(-1),
        ValidationError
      );
    });
    it(`should validate string number`, function(){
      assert.strictEqual(
        Id.validator("2"),
        2
      );
    });
    it(`should validate number`, function(){
      assert.strictEqual(
        Id.validator(3),
        3
      );
    });
    it(`should validate entities that return a string number`, function(){
      assert.strictEqual(
        Id.validator({
          definitively: `not a number`,
          toString(){ return "12345";}
        } as unknown as string),
        12345
      );
    });
  });
});