import {describe, it, after} from "node:test";
import fs from "node:fs/promises";
import assert from "node:assert";
import path from "node:path";
import startServer from "./server";

async function sleep(){
  await new Promise (r => setTimeout(r,200));
}

describe(`Test log file creation`, function(){
  after(async function(){
      await fs.rm(path.resolve(__dirname,`./logs/error.log`));
      await fs.rm(path.resolve(__dirname,`./logs/server.log`));
      await sleep();
  });
  it(`Should log errors to two files`, async function(){
    await startServer();
    await sleep();
    const errMsg = `This is an error log.`;
    const testsContents = await fs.readFile(path.resolve(__dirname,`./logs/server.log`), {encoding:`utf-8`});
    assert.strictEqual(
      JSON.parse(testsContents.split(`\n`).filter(v=>!!v).slice(-1)[0]).message,
      errMsg
    );
    const errorContents = await fs.readFile(path.resolve(__dirname,`./logs/error.log`), {encoding:`utf-8`});
    assert.strictEqual(
      JSON.parse(errorContents.split(`\n`).filter(v=>!!v).slice(-1)[0]).message,
      errMsg
    );
  });
});

