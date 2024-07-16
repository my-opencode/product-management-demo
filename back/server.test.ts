import { describe, it, after, before } from "node:test";
import fs from "node:fs/promises";
import assert from "node:assert";
import path from "node:path";
import startServer from "./server";
import inject, { Response } from "light-my-request";
import { Express } from "express";
import { ProductAsInTheJson } from "./models/Products";
import productsRouter from "./routes/products";
import errorHandler from "./controllers/errorHandler";
import default404 from "./controllers/default.404";

async function sleep() {
  await new Promise(r => setTimeout(r, 200));
}

describe(`Test log file creation`, function () {
  before(async function () {
    await sleep();
  })
  after(async function () {
    // await fs.rm(path.resolve(__dirname,`./logs/error.log`));
    await fs.rm(path.resolve(__dirname, `./logs/server.log`));
    await sleep();
  });
  it(`Should log notices to file`, async function () {
    await startServer({ skipListen: true, skipDatabase: true, skipRoutes: true });
    await sleep();
    // const errMsg = `This is an error log.`;
    const testsContents = await fs.readFile(path.resolve(__dirname, `./logs/server.log`), { encoding: `utf-8` });
    const firstLog = JSON.parse(
      testsContents
        .split(`\n`)
        .filter(v => !!v)
        .find(l => l.includes(`{"level":"info","message":"Initializing start server sequence.","service":"server"}`)) || ``
    );
    assert.strictEqual(
      firstLog.message,
      `Initializing start server sequence.`
    );
    assert.strictEqual(firstLog.level, `info`);
    // const errorContents = await fs.readFile(path.resolve(__dirname,`./logs/error.log`), {encoding:`utf-8`});
    // assert.strictEqual(
    //   JSON.parse(errorContents.split(`\n`).filter(v=>!!v).slice(-1)[0]).message,
    //   errMsg
    // );
  });
});

describe(`Test API endpoints`, function () {
  let app: Express;
  before(async function () {
    app = await startServer({ skipListen: true });
  });
  after(function(){
    app.emit(`close`);
  });
  describe(`404`, function () {
    it(`should return status code 404`, async function () {
      const response = await inject(app, { method: `get`, url: `/` });
      assert.strictEqual(response.statusCode, 404);
      assert.strictEqual(response.payload, `Resource "/" not found.`);
    });
  });
  describe(`GET /products`, async function () {
    let response: Response;
    let json: Array<ProductAsInTheJson>;
    await before(async function () {
      response = await inject(app, { method: `get`, url: `/products` });
    });
    it(`should return status code 200`, function () {
      assert.strictEqual(response.statusCode, 200);
    });
    it(`should return json array`, function () {
      assert.strictEqual(typeof response.payload, `string`);
      json = JSON.parse(response.payload);
      console.log(typeof json, json.length);
      assert.strictEqual(Array.isArray(json), true);
    });
    it(`should return all products`, function () {
      assert.strictEqual(json.length, 30);
    });
  });
});

describe(`Test API error endpoint`, function () {
  let app: Express;
  before(async function () {
    app = await startServer({ skipListen: true, skipRoutes:true });
    
    app.use(`/error`,function(){throw new Error(`Something went unexpectedly wrong!`);});
    app.use(`/products`, productsRouter);
    app.use(errorHandler);
    app.use(default404);
  });
  after(function(){
    app.emit(`close`);
  });
  describe(`Error Handler`, async function () {
    let response: Response;
    await before(async function () {
      response = await inject(app, { method: `get`, url: `/error` });
    });
    it(`should return status code 500`, function () {
      assert.strictEqual(response.statusCode, 500);
    });
    it(`should return json array`, function () {
      assert.strictEqual(response.payload, `Unexpected error. Please contact our support if the error persists.`);
    });
  });
});

