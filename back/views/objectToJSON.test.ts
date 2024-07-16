import { describe, it } from "node:test";
import * as assert from "node:assert";
import objectToJSON from "./objectToJSON";

describe(`object to json view`, function(){
  it(`should return stringified json`, function(){
    assert.strictEqual(objectToJSON({a:2,b:"hello",c:["world"]}),`{"a":2,"b":"hello","c":["world"]}`);
  });
});