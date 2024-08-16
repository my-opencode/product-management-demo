import { describe, it, after, before } from "node:test";
import fs from "node:fs/promises";
import path from "node:path";
import startServer from "./server";
import inject, { Response, InjectOptions } from "light-my-request";
import { Express } from "express";

type HTTPMethods = 'DELETE' | 'delete' |
                   'GET' | 'get' |
                   'HEAD' | 'head' |
                   'PATCH' | 'patch' |
                   'POST' | 'post' |
                   'PUT' | 'put' |
                   'OPTIONS' | 'options'

import assert from "node:assert";
import apiTester, { ServerTester, ServerTesterHeaders } from "./server.template.test";

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

class IntegrationServerTester extends ServerTester {
  _response?: Response;
  _app?: Express;
  static skipListen = true;
  constructor(
    path: string,
    method?: string,
    headers?: ServerTesterHeaders,
    body?: string
  ) {
    super(path, method, headers, body);
    if (!IntegrationServerTester.app) throw new Error(`App is required for integration test.`);
    this._app = IntegrationServerTester.app;
  }
  async fetch() {
    if(!this._app) throw new Error(`Cannot fetch without app.`);
    const options: InjectOptions = {
      url: this.url
    };
    if (this.method) options.method = this.method as HTTPMethods;
    if (this.headers) options.headers = this.headers;
    if (this.body) options.body = this.body;
    this._response = await inject(this._app, options);
    return this;
  }
  async testCode(code: number, errMsg?: string): Promise<void> {
    if (!this._response) throw new Error(`Cannot test before fetch.`);
    assert.strictEqual(this._response.statusCode, code, errMsg);
  }
  async testHeader(key: string, val: string, errMsg?: string): Promise<void> {
    if (!this._response) throw new Error(`Cannot test before fetch.`);
    assert.strictEqual(this._response.headers[key], val, errMsg);
  }
  async testJsonBody(expected: any|Function, errMsg?: string): Promise<void> {
    if (!this._response) throw new Error(`Cannot test before fetch.`);
    if(expected instanceof Function) expected(JSON.parse(this._response.payload));
    else assert.deepEqual(JSON.parse(this._response.payload), expected, errMsg);
  }
  async testTextBody(expected: any|Function, errMsg?: string): Promise<void> {
    if (!this._response) throw new Error(`Cannot test before fetch.`);
    if(expected instanceof Function) expected(this._response.payload);
    else assert.strictEqual(this._response.payload, expected, errMsg);
  }
}

apiTester(IntegrationServerTester, "I");
