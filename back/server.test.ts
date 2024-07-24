import { describe, it, after, before } from "node:test";
import fs from "node:fs/promises";
import assert from "node:assert";
import path from "node:path";
import startServer from "./server";
import inject, { Response } from "light-my-request";
import express, { Express } from "express";
import { ProductAsInTheJson } from "./models/Products";
import { CategoryFromDb } from "./models/Categories";
import productsRouter from "./routes/products";
import categoriesRouter from "./routes/categories";
import errorHandler from "./controllers/errorHandler";
import default404 from "./controllers/default.404";
import validationErrorHandler from "./controllers/validation-error-handler";
import { ValidationErrorResponseJson } from "./views/422-validation";

const REAL_PRODUCT_ID = 1000;

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
  after(function () {
    app.emit(`close`);
  });
  describe(`CORS`, function () {
    it(`should allow cross origin in header`, async function () {
      const response = await inject(app, { method: `get`, url: `/` });
      assert.strictEqual(response.headers["access-control-allow-origin"], `*`);
    });
  });
  describe(`404`, function () {
    it(`should return status code 404`, async function () {
      const response = await inject(app, { method: `get`, url: `/` });
      assert.strictEqual(response.statusCode, 404);
      assert.strictEqual(response.payload, `Resource "/" not found.`);
    });
  });
  describe(`GET /categories`, async function () {
    let response: Response;
    let json: { data: Array<CategoryFromDb> };
    await before(async function () {
      response = await inject(app, { method: `get`, url: `/categories` });
    });
    it(`should return status code 200`, function () {
      assert.strictEqual(response.statusCode, 200);
    });
    it(`should return json array`, function () {
      assert.strictEqual(typeof response.payload, `string`);
      json = JSON.parse(response.payload);
      assert.strictEqual(Array.isArray(json.data), true);
    });
    it(`should return categories`, function () {
      assert.strictEqual(json.data.length > 0, true);
    });
  });
  describe(`GET /products`, async function () {
    let response: Response;
    let json: { data: Array<ProductAsInTheJson> };
    await before(async function () {
      response = await inject(app, { method: `get`, url: `/products` });
    });
    it(`should return status code 200`, function () {
      assert.strictEqual(response.statusCode, 200);
    });
    it(`should return json array`, function () {
      assert.strictEqual(typeof response.payload, `string`);
      json = JSON.parse(response.payload);
      assert.strictEqual(Array.isArray(json.data), true);
    });
    it(`should return products`, function () {
      assert.strictEqual(json.data.length > 0, true);
    });
  });
  describe(`POST /products 422`, async function () {
    let response: Response;
    let json: ValidationErrorResponseJson;
    await before(async function () {
      response = await inject(app, {
        method: `post`,
        url: `/products`,
        body: `{"rating":6}`,
        headers: {
          "content-type": `application/json`
        }
      });
    });
    it(`should return status code 422`, function () {
      assert.strictEqual(response.statusCode, 422);
    });
    it(`should return error json object`, function () {
      assert.strictEqual(typeof response.payload, `string`);
      json = JSON.parse(response.payload);
      assert.strictEqual(json.description, `Invalid Product`);
    });
    it(`should list errors`, function () {
      assert.strictEqual(json.errors[`product.rating`], `Too high. Max value: 5.`);
    });
  });
  describe(`POST /products 409 Category_id`, async function () {
    let response: Response;
    let json: ValidationErrorResponseJson;
    await before(async function () {
      response = await inject(app, {
        method: `post`,
        url: `/products`,
        headers: {
          "content-type": `application/json`
        },
        body: JSON.stringify(
          {
            category: 20,
            code: `a`,
            name: `a`,
            description: `a`,
            quantity: 10,
            price: 10.1,
          }
        )
      });
    });
    it(`should return status code 409`, function () {
      assert.strictEqual(response.statusCode, 409);
    });
    it(`should return error json object`, function () {
      assert.strictEqual(typeof response.payload, `string`);
      json = JSON.parse(response.payload);
      assert.strictEqual(json.description, `Conflicting Product`);
    });
    it(`should list errors`, function () {
      assert.strictEqual(json.errors[`product.categoryId`], `Product Category does not exist.`);
    });
  });
  describe(`POST /products 409 code`, async function () {
    let response: Response;
    let json: ValidationErrorResponseJson;
    await before(async function () {
      response = await inject(app, {
        method: `post`,
        url: `/products`,
        headers: {
          "content-type": `application/json`
        },
        body: JSON.stringify(
          {
            category: 2,
            code: `f230fh0g3`,
            name: `a`,
            description: `a`,
            quantity: 10,
            price: 10.1,
          }
        )
      });
    });
    it(`should return status code 409`, function () {
      assert.strictEqual(response.statusCode, 409);
    });
    it(`should return error json object`, function () {
      assert.strictEqual(typeof response.payload, `string`);
      json = JSON.parse(response.payload);
      assert.strictEqual(json.description, `Conflicting Product`);
    });
    it(`should list errors`, function () {
      assert.strictEqual(json.errors[`product.code`], `Duplicate value for code.`);
    });
  });
  describe(`GET /products/:id`, async function () {
    let response: Response;
    let json: { data: ProductAsInTheJson };
    await before(async function () {
      response = await inject(app, { method: `get`, url: `/products/${REAL_PRODUCT_ID}` });
    });
    it(`should return status code 200`, function () {
      assert.strictEqual(response.statusCode, 200);
    });
    it(`should return json object`, function () {
      assert.strictEqual(typeof response.payload, `string`);
      json = JSON.parse(response.payload);
      console.log(typeof json, json.data.length);
      assert.strictEqual(json.data.id, REAL_PRODUCT_ID);
    });
  });
  describe(`GET /products/:id 400`, async function () {
    let response: Response;
    let json: ProductAsInTheJson;
    await before(async function () {
      response = await inject(app, { method: `get`, url: `/products/0` });
    });
    it(`should return status code 400`, function () {
      assert.strictEqual(response.statusCode, 400);
    });
  });
  describe(`GET /products/:id 404`, async function () {
    let response: Response;
    let json: ProductAsInTheJson;
    await before(async function () {
      response = await inject(app, { method: `get`, url: `/products/999999` });
    });
    it(`should return status code 404`, function () {
      assert.strictEqual(response.statusCode, 404);
    });
  });
});

describe(`Test API error endpoint`, function () {
  let app: Express;
  before(async function () {
    app = await startServer({ skipListen: true, skipRoutes: true });

    const router = express.Router();
    router.use(`/error`, () => { throw new Error(`Oops!`) })
    router.use(`/categories`, categoriesRouter);
    router.use(`/products`, productsRouter);
    router.use(validationErrorHandler);
    router.use(errorHandler);
    router.use(default404);
    app.use(router);
  });
  after(function () {
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
    it(`should return message`, function () {
      assert.strictEqual(response.payload, `Unexpected error. Please contact our support if the error persists.`);
    });
  });
});

