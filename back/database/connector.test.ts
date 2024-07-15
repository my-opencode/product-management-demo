import connector, {waitForDbServer} from "./connector";
import { describe, it, after, before } from "node:test";
import * as assert from "node:assert";
import mysql, { FieldPacket, RowDataPacket } from "mysql2/promise";
import databaseConfig from "./config";

// from mysql2/lib/constants/types.js
const typeDict: { [key: number]: string } = {
  0x00: 'DECIMAL', // aka DECIMAL 
  0x01: 'TINY', // aka TINYINT, 1 byte
  0x02: 'SHORT', // aka SMALLINT, 2 bytes
  0x03: 'LONG', // aka INT, 4 bytes
  0x04: 'FLOAT', // aka FLOAT, 4-8 bytes
  0x05: 'DOUBLE', // aka DOUBLE, 8 bytes
  0x06: 'NULL', // NULL (used for prepared statements, I think)
  0x07: 'TIMESTAMP', // aka TIMESTAMP
  0x08: 'BIGINT', // aka BIGINT, 8 bytes
  // 0x08: 'LONGLONG', // aka BIGINT, 8 bytes
  0x09: 'INT24', // aka MEDIUMINT, 3 bytes
  0x0a: 'DATE', // aka DATE
  0x0b: 'TIME', // aka TIME
  0x0c: 'DATETIME', // aka DATETIME
  0x0d: 'YEAR', // aka YEAR, 1 byte (don't ask)
  0x0e: 'NEWDATE', // aka ?
  0x0f: 'VARCHAR', // aka VARCHAR (?)
  0x10: 'BIT', // aka BIT, 1-8 byte
  0xf5: 'JSON',
  0xf6: 'NEWDECIMAL', // aka DECIMAL
  0xf7: 'ENUM', // aka ENUM
  0xf8: 'SET', // aka SET
  0xf9: 'TINY_BLOB', // aka TINYBLOB, TINYTEXT
  0xfa: 'MEDIUM_BLOB', // aka MEDIUMBLOB, MEDIUMTEXT
  0xfb: 'LONG_BLOB', // aka LONGBLOG, LONGTEXT
  0xfc: 'BLOB', // aka BLOB, TEXT
  0xfd: 'VAR_STRING', // aka VARCHAR, VARBINARY
  0xfe: 'STRING', // aka CHAR, BINARY
  0xff: 'GEOMETRY' // aka GEOMETRY
};
// from mysql2/lib/constants/field_flags.js
const flagValues: { [key: string]: number } = {
  // Manually extracted from mysql-5.5.23/include/mysql_com.h
  NOT_NULL: 1, /* Field can't be NULL */
  PRI_KEY: 2, /* Field is part of a primary key */
  UNIQUE_KEY: 4, /* Field is part of a unique key */
  MULTIPLE_KEY: 8, /* Field is part of a key */
  BLOB: 16, /* Field is a blob */
  UNSIGNED: 32, /* Field is unsigned */
  ZEROFILL: 64, /* Field is zerofill */
  BINARY: 128, /* Field is binary   */

  /* The following are only sent to new clients */
  ENUM: 256, /* field is an enum */
  AUTO_INCREMENT: 512, /* field is a autoincrement field */
  TIMESTAMP: 1024, /* Field is a timestamp */
  SET: 2048, /* field is a set */
  NO_DEFAULT_VALUE: 4096, /* Field doesn't have default value */
  ON_UPDATE_NOW: 8192, /* Field is set to NOW on UPDATE */
  NUM: 32768, /* Field is num (for clients) */
}

describe(`Database connector`, async function () {
  let pool: mysql.Pool;
  let result: [mysql.RowDataPacket[], mysql.FieldPacket[]];
  before(async function () {
    // Waiting for the database server
    // TODO add env flag to trigger this behavior
    await waitForDbServer();
    pool = connector();
  });
  after(function () {
    if (pool)
      pool.end();
  });
  await it(`Pool should connect & query`, async function () {
    result = await pool.execute(`select 1 as nbr;`) as [RowDataPacket[], FieldPacket[]];
  });
  it(`should return object array`, function () {
    assert.deepStrictEqual(result?.[0], [{ nbr: 1 }]);
  });
  it(`should return fields array`, function () {
    // console.log(result[1]);
    assert.strictEqual(Array.isArray(result?.[1]), true);
    assert.strictEqual(typeof (result[1][0]), "object");
    // Object.entries(result[1][0]).forEach(([k,v]) => console.log(k, v));
    assert.strictEqual(result[1][0].name, "nbr");
    assert.strictEqual(typeDict[(result[1][0].type as unknown as number)], "BIGINT");
    assert.strictEqual(result[1][0].columnLength, 2);
    let _f = result[1][0].flags as number;
    const _fs = Object.entries(flagValues)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .reduce((arr, [k, v]) => {
        if (_f >= (v as number)) {
          arr.push(k);
          _f -= (v as number);
        }
        return arr;
      }, [] as string[])
    assert.deepStrictEqual(_fs, [`BINARY`, `NOT_NULL`]);
    // assert.strictEqual(String(result?.[1]), "[ `nbr` BIGINT(2) NOT NULL ]");
  });
});

