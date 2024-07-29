import { describe, it, after, before } from "node:test";
import fs from "node:fs/promises";
import assert from "node:assert";
import path from "node:path";
import startServer from "./server";
import inject, { Response } from "light-my-request";
import express, { Express } from "express";
import { ProductAsInTheJson } from "./models/product";
import { CategoryFromDb } from "./models/category";
import productsRouter from "./routes/products";
import categoriesRouter from "./routes/categories";
import errorHandler from "./controllers/error-handler";
import default404 from "./controllers/default-404";
import validationErrorHandler from "./controllers/validation-error-handler";
import { ValidationErrorStackJsonResponse } from "./views/json-response-format";

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
  describe(`415`, function () {
    it(`should return status code 415`, async function () {
      const response = await inject(app, {
        method: `get`,
        url: `/`,
        headers: {
          accept: `text/html`
        }
      });
      assert.strictEqual(response.statusCode, 415);
      assert.strictEqual(response.payload, `This API only supports application/json media type.`);
    });
  });
  describe(`404`, function () {
    it(`should return status code 404`, async function () {
      const response = await inject(app, { method: `get`, url: `/` });
      assert.strictEqual(response.statusCode, 404);
      assert.strictEqual(response.payload, `{"description":"Resource \\"/\\" not found."}`);
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
    let json: ValidationErrorStackJsonResponse;
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
    let json: ValidationErrorStackJsonResponse;
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
    let json: ValidationErrorStackJsonResponse;
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
  describe(`POST /products 201`, async function () {
    let response: Response;
    let json: ProductAsInTheJson;
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
            code: `abcdef`,
            name: `a`,
            description: `a`,
            quantity: 10,
            price: 10.1,
          }
        )
      });
    });
    it(`should return status code 201`, function () {
      assert.strictEqual(response.statusCode, 201);
    });
    it(`should return json object`, function () {
      assert.strictEqual(typeof response.payload, `string`);
      json = JSON.parse(response.payload);
      assert.ok(json.data.id > 1000);
      assert.strictEqual(json.data.code, `abcdef`);
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
    await before(async function () {
      response = await inject(app, { method: `get`, url: `/products/0` });
    });
    it(`should return status code 400`, function () {
      assert.strictEqual(response.statusCode, 400);
    });
  });
  describe(`GET /products/:id 404`, async function () {
    let response: Response;
    await before(async function () {
      response = await inject(app, { method: `get`, url: `/products/999999` });
    });
    it(`should return status code 404`, function () {
      assert.strictEqual(response.statusCode, 404);
    });
  });
  describe(`PATCH /products/:id 404`, async function () {
    let response: Response;
    await before(async function () {
      response = await inject(app, { method: `patch`, url: `/products/999999`, headers: { "content-type": `application/json` } });
    });
    it(`should return status code 404`, function () {
      assert.strictEqual(response.statusCode, 404);
    });
  });
  describe(`PATCH /products/:id 422 - validation`, async function () {
    let response: Response;
    let json: ValidationErrorStackJsonResponse;
    await before(async function () {
      response = await inject(app, {
        method: `patch`,
        url: `/products/${REAL_PRODUCT_ID}`,
        body: `{"code":"${``.padEnd(256, `a`)}","image":"${``.padEnd(2049, `a`)}"}`,
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
      assert.strictEqual(json.description, `Invalid Changes`);
    });
    it(`should list errors`, function () {
      assert.strictEqual(json.errors[`product.code`], `Too long. Max length: 255.`);
      assert.strictEqual(json.errors[`product.image`], `Too long. Max length: 2048.`);
    });
  });
  describe(`PATCH /products/:id 422 - no change`, async function () {
    let response: Response;
    let json: ValidationErrorStackJsonResponse;
    await before(async function () {
      const sourceValues = {
        "id": 1000,
        "code": "f230fh0g3",
        "name": "Bamboo Watch",
        "description": "Product Description",
        "image": "bamboo-watch.jpg",
        "price": 65,
        "category": "Accessories",
        "categoryId": 1,
        "quantity": 24,
        "inventoryStatus": "INSTOCK",
        "rating": 5
      };
      response = await inject(app, {
        method: `patch`,
        url: `/products/${sourceValues.id}`,
        body: JSON.stringify(sourceValues),
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
      assert.strictEqual(json.description, `Expected changes.`);
    });
  });
  describe(`PATCH /products/:id 409 - code exists`, async function () {
    let response: Response;
    let json: ValidationErrorStackJsonResponse;
    await before(async function () {
      response = await inject(app, {
        method: `patch`,
        url: `/products/${REAL_PRODUCT_ID}`,
        body: `{"code":"nvklal433"}`, // code of 1001
        headers: {
          "content-type": `application/json`
        }
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
  describe(`PATCH /products/:id 409 - category does not exist`, async function () {
    let response: Response;
    let json: ValidationErrorStackJsonResponse;
    await before(async function () {
      response = await inject(app, {
        method: `patch`,
        url: `/products/${REAL_PRODUCT_ID}`,
        body: `{"categoryId":9999}`, // code of 1001
        headers: {
          "content-type": `application/json`
        }
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
  describe(`PATCH /products/:id 200`, async function () {
    let response: Response;
    let json: { data: ProductAsInTheJson };
    await before(async function () {
      response = await inject(app, {
        method: `patch`,
        url: `/products/${REAL_PRODUCT_ID}`,
        body: `{"code":"abcd","name":"product abcd","description":"product abcd desc","image":"abcd.png","category":"my category","categoryId":2,"price":125.25,"quantity":"5"}`,
        headers: {
          "content-type": `application/json`
        }
      });
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
    it(`should reflect all changes`, function () {
      json = JSON.parse(response.payload);
      assert.strictEqual(json.data.code, `abcd`);
      assert.strictEqual(json.data.name, `product abcd`);
      assert.strictEqual(json.data.description, `product abcd desc`);
      assert.strictEqual(json.data.image, `abcd.png`);
      assert.strictEqual(json.data.categoryId, 2);
      assert.strictEqual(json.data.category, "Fitness");
      assert.strictEqual(json.data.price, 125.25);
      assert.strictEqual(json.data.quantity, 5);
      assert.strictEqual(json.data.inventoryStatus, `LOWSTOCK`);
    });
  });
  describe(`DELETE /products/:id 404`, async function () {
    let response: Response;
    await before(async function () {
      response = await inject(app, { method: `delete`, url: `/products/999999` });
    });
    it(`should return status code 404`, function () {
      assert.strictEqual(response.statusCode, 404);
    });
  });
  describe(`DELETE /products/:id 204`, async function () {
    let response: Response;
    await before(async function () {
      response = await inject(app, {
        method: `delete`,
        url: `/products/${REAL_PRODUCT_ID}`
      });
    });
    it(`should return status code 204`, function () {
      assert.strictEqual(response.statusCode, 204);
    });
    it(`should not return response body`, function () {
      assert.strictEqual(typeof response.payload, `string`);
      assert.strictEqual(response.payload, ``);
    });
  });
  describe(`Create -> Update -> List of unique products`, async function () {
    describe(`Create product`, async function () {
      let response: Response;
      let prod: ProductAsInTheJson;
      await before(async function () {
        response = await inject(app, {
          method: `post`,
          url: `/products`,
          headers: {
            "content-type": `application/json`
          },
          body: JSON.stringify(
            {
              category: 3,
              code: `create-update-list`,
              name: `create-update-list`,
              description: `tests create update list`,
              quantity: 10,
              price: 10.1,
            }
          )
        });
        prod = JSON.parse(response.payload).data;
      });
      it(`should return status code 201`, function () {
        assert.strictEqual(response.statusCode, 201);
      });
      describe(`Update product`, async function () {
        let response: Response;
        await before(async function () {
          // ensure different values for NOW()
          await new Promise(r => setTimeout(r, 1000));
          response = await inject(app, {
            method: `patch`,
            url: `/products/${prod.id}`,
            body: `{"price":20.2,"quantity":"20"}`,
            headers: {
              "content-type": `application/json`
            }
          });
        });
        it(`should return status code 200`, function () {
          assert.strictEqual(response.statusCode, 200);
        });
        describe(`List products`, async function () {
          let response: Response;
          let json: { data: Array<ProductAsInTheJson> };
          await before(async function () {
            await new Promise(r => setTimeout(r, 1000));
            response = await inject(app, { method: `get`, url: `/products` });
            json = JSON.parse(response.payload);
          });
          it(`should return status code 200`, function () {
            assert.strictEqual(response.statusCode, 200);
          });
          it(`should not return duplicated products`, function () {
            assert.strictEqual(json.data.filter(p => p.id === prod.id).length, 1);
          });
        });
      });
    });
  });
  describe(`#62 Cannot set quantity to 0`, async function () {
    describe(`Create product`, async function () {
      let response: Response;
      let prod: ProductAsInTheJson;
      await before(async function () {
        response = await inject(app, {
          method: `post`,
          url: `/products`,
          headers: {
            "content-type": `application/json`
          },
          body: JSON.stringify(
            {
              category: 3,
              code: `set-quantity-to-zero`,
              name: `set-quantity-to-zero`,
              description: `tests set-quantity-to-zero`,
              quantity: 10,
              price: 10.1,
            }
          )
        });
        prod = JSON.parse(response.payload).data;
      });
      it(`should return status code 201`, function () {
        assert.strictEqual(response.statusCode, 201);
      });
      describe(`Update product`, async function () {
        let response: Response;
        await before(async function () {
          // ensure different values for NOW()
          await new Promise(r => setTimeout(r, 1000));
          response = await inject(app, {
            method: `patch`,
            url: `/products/${prod.id}`,
            body: `{"quantity":"0"}`,
            headers: {
              "content-type": `application/json`
            }
          });
        });
        it(`should return status code 200`, function () {
          assert.strictEqual(response.statusCode, 200);
        });
        describe(`Get product`, async function () {
          let response: Response;
          let json: { data: ProductAsInTheJson };
          await before(async function () {
            await new Promise(r => setTimeout(r, 1000));
            response = await inject(app, { method: `get`, url: `/products/${prod.id}` });
            json = JSON.parse(response.payload);
          });
          it(`should return status code 200`, function () {
            assert.strictEqual(response.statusCode, 200);
          });
          it(`should return product with qty = 0`, function () {
            assert.strictEqual(json.data.quantity, 0);
          });
        });
      });
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
      assert.deepEqual(
        response.payload,
        `{"description":"Unexpected error. Please contact our support if the error persists."}`
      );
    });
  });
});

