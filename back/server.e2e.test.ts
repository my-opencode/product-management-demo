import assert from "node:assert";
import apiTester, { ServerTester, ServerTesterHeaders } from "./server.template.test";

const PORT = process.env.PORT || 3000;
function getUrl(path: string) {
  const url = `http://127.0.0.1:${PORT}${path}`;
  return url;
}

class E2EServerTester extends ServerTester {
  _response?: globalThis.Response;
  static skipListen = false;
  constructor(
    path: string,
    method?: string,
    headers?: ServerTesterHeaders,
    body?: string
  ) {
    super(path, method, headers, body);
    this.url =  getUrl(this.url);
  }
  async fetch() {
    const options: RequestInit = {
      mode: "cors"
    };
    if (this.method) options.method = this.method;
    if (this.headers) options.headers = this.headers;
    if (this.body) options.body = this.body;
    console.log(`e2e fetcher ${this.url} with options ${JSON.stringify(options)}`);
    this._response = await fetch(
      this.url,
      options
    );
    return this;
  }
  async testCode(code: number, errMsg?: string): Promise<void> {
    if (!this._response) throw new Error(`Cannot test before fetch.`);
    if (code > 199 && code < 300)
      assert.strictEqual(this._response.ok, true, `Response should be ok for codes inside the 2xx range.`);
    else
    assert.strictEqual(this._response.ok, false, `Response should not be ok for codes outside the 2xx range.`);
  assert.strictEqual(this._response.status, code, errMsg);
  }
  async testHeader(key: string, val: string, errMsg?: string): Promise<void> {
    if (!this._response) throw new Error(`Cannot test before fetch.`);
    assert.strictEqual(this._response.headers.get(key), val, errMsg);
  }
  async testJsonBody(expected: any|Function, errMsg?: string): Promise<void> {
    if (!this._response) throw new Error(`Cannot test before fetch.`);
    if(!this._isBodyRead) {
      this._responseBody = await this._response.json();
      this._isBodyRead = true;
      this._isBodyText = false;
    }
    const json = !this._isBodyText ? this._responseBody : JSON.parse(this._responseBody);
    if(expected instanceof Function) expected(json);
    else assert.deepEqual(json, expected, errMsg);
  }
  async testTextBody(expected: any|Function, errMsg?: string): Promise<void> {
    if (!this._response) throw new Error(`Cannot test before fetch.`);
    if(!this._isBodyRead) {
      this._responseBody = await this._response.text();
      this._isBodyRead = true;
      this._isBodyText = true;
    }
    const text = this._isBodyText ? this._responseBody : JSON.stringify(this._responseBody);
    if(expected instanceof Function) expected(text);
    else assert.strictEqual(text, expected, errMsg);
  }
}

apiTester(E2EServerTester, "E2E");
