import {describe, it, after} from "node:test";
import fs from "node:fs/promises";
import assert from "node:assert";
import path from "node:path";
import Logger from "./winston";

async function sleep(){
  await new Promise (r => setTimeout(r,200));
}

describe(`Test log file creation`, function(){
  after(async function(){
      await fs.rm(path.resolve(__dirname,`../logs/error.log`));
      await fs.rm(path.resolve(__dirname,`../logs/tests.log`));
      await sleep();
  });
  const logger = Logger(`tests`);
  it(`Should create a file ../logs/tests.log`, async function(){
    logger.info(`Create a tests log file.`);
    await sleep();
    const fnames = await fs.readdir(path.resolve(__dirname,`../logs`));
    assert(fnames.includes(`tests.log`));
  });
  it(`Should log errors to two files`, async function(){
    const errMsg = `Something bad happened!`
    logger.error(errMsg);
    await new Promise (r => setTimeout(r,200));
    const testsContents = await fs.readFile(path.resolve(__dirname,`../logs/tests.log`), {encoding:`utf-8`});
    assert.strictEqual(
      JSON.parse(testsContents.split(`\n`).filter(v=>!!v).slice(-1)[0]).message,
      errMsg
    );
    const errorContents = await fs.readFile(path.resolve(__dirname,`../logs/error.log`), {encoding:`utf-8`});
    assert.strictEqual(
      JSON.parse(errorContents.split(`\n`).filter(v=>!!v).slice(-1)[0]).message,
      errMsg
    );
  });
});

