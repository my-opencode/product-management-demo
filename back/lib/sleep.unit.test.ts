import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import sleep from "./sleep";

describe(`Unsupported values`, function () {
  let startTime: Date;
  beforeEach(function () {
    startTime = new Date();
  });
  it(`Should ignore negative values`, async function () {
    await sleep(-10);
    const endTime = new Date();
    assert.strictEqual(endTime >= startTime, true);
  });
  it(`Should ignore 0 value`, async function () {
    await sleep(0);
    const endTime = new Date();
    assert.strictEqual(endTime >= startTime, true);
  });
  it(`Should throw for values above 10000`, async function () {
    await assert.rejects(()=>sleep(10001));
  });
});
describe(`Supported values`,function(){
  it(`should wait at least t ms`, async function(){
    const startTime = new Date();
    await sleep(2000);
    const endTime = new Date();
    assert.strictEqual(endTime.getTime() - startTime.getTime() >= 2000, true);
  });
});
