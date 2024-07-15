import databaseConfig from "./config";
import { describe, it } from "node:test";
import assert from "node:assert";

describe(`Database connection required config fields`, function(){
  // Not required for now
  // it(`Should have a host`, function(){
  //   assert.strictEqual(
  //     typeof databaseConfig.host,
  //     `string`
  //   );
  // });
  it(`Should have a port`, function(){
    assert.strictEqual(
      typeof databaseConfig.port,
      `number`
    );
  });
  it(`Should have a database`, function(){
    assert.strictEqual(
      typeof databaseConfig.database,
      `string`
    );
  });
  it(`Should have an user`, function(){
    assert.strictEqual(
      typeof databaseConfig.user,
      `string`
    );
  });
  it(`Should have a password`, function(){
    assert.strictEqual(
      typeof databaseConfig.password,
      `string`
    );
  });
});