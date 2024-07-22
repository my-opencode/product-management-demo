import assert from "node:assert";
import { describe, it } from "node:test";
import renderer from "./category-list";
import { RowDataPacket } from "mysql2";

describe(`category list renderer`, function () {
  it(`should return a json string`, function () {
    assert.strictEqual(
      renderer([
        //@ts-ignore
        { id: 1, name: `some category` }
      ]),
      `{"data":[{"id":1,"name":"some category"}]}`
    )
  });
});