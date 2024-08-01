import { describe, it, after, before } from "node:test";
import * as assert from "node:assert";
import connector, { waitForDbServer } from "./connector";
import { Pool, FieldPacket } from "mysql2/promise";
import mysql from "mysql2/promise";

interface CountQueryResult extends mysql.RowDataPacket {
  cnt?: number;
}

describe(`Test DB rebuild`, function () {
  let pool: Pool;
  before(async function () {
    await waitForDbServer();
    pool = connector();
  });
  after(function () {
    pool.end();
  })
  it(`Database should be populated`, async function () {
    const [result] = (await pool.execute(
      "SELECT COUNT(DISTINCT `id`) AS cnt FROM `Products`;"
    )) as [CountQueryResult, FieldPacket[]];
    assert.strictEqual(
      result[0].cnt,
      30
    );
  });
});