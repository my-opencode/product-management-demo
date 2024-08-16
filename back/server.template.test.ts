import { describe, it, after, before } from "node:test";
import assert from "node:assert";
import startServer from "./server";
import express, { Express } from "express";
import { ProductAsInTheJson } from "./models/product.types";
import { CategoryFromDb } from "./models/category";
import productsRouter from "./routes/products";
import categoriesRouter from "./routes/categories";
import errorHandler from "./controllers/error-handler";
import default404 from "./controllers/default-404";
import validationErrorHandler from "./controllers/error-validation-handler";
import { ValidationErrorStackJsonResponse } from "./views/json-response-format";
import { Response } from "light-my-request";
import sleep from "./lib/sleep";

export type Newable<T> = { new(...args: any[]): T; skipListen:boolean; app?:Express };

export type ServerTesterHeaders = Record<string, string>;

export class ServerTester {
  url: string;
  method?: string;
  headers?: ServerTesterHeaders;
  body?: string;
  _response?: Response | globalThis.Response;
  _isBodyRead: boolean;
  _isBodyText: boolean;
  _responseBody?: any;
  static skipListen:boolean;
  static app?:Express;
  constructor(
    path: string,
    method?: string,
    headers?: ServerTesterHeaders,
    body?: string
  ) {
    this._isBodyRead = false;
    this._isBodyText = true;
    this.url = path;
    if (method) this.method = method;
    if (headers) this.headers = headers;
    if (body) this.body = body;
  }
  async fetch(): Promise<ServerTester> {
    return this;
  }
  async testCode(code: number, errMsg?: string): Promise<void> { }
  async testHeader(key: string, val: string, errMsg?: string): Promise<void> { }
  async testTextBody(expected: string | Function, errMsg?: string): Promise<void> { }
  async testJsonBody(expected: any | Function, errMsg?: string): Promise<void> { }
}

const acceptText = {
  "Accept": `text/html`
}
const acceptJson = {
  "Accept": `application/json`
};
const acceptContentJson = {
  "Accept": `application/json`,
  "Content-Type": `application/json`
};

export default async function apiTester(TesterClass: Newable<ServerTester>, testVariant:"I"|"E2E") {
  describe(`Test API endpoints (${testVariant})`, function () {
    let app: Express;
    before(async function () {
      app = await startServer({skipListen: TesterClass.skipListen});
      TesterClass.app = app;
    });
    after(function () {
      app.emit(`close`);
    });
    describe(`${testVariant} CORS`, function () {
      let tester: ServerTester;
      before(function () {
        tester = new TesterClass(`/`, `GET`);
      });
      it(`should allow cross origin in header`, async function () {
        await tester.fetch();
        await tester.testHeader("access-control-allow-origin", `*`);
      });
    });
    describe(`${testVariant} Accept 415`, function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/`, `GET`, acceptText);
        await tester.fetch();
      });
      it(`should return status code 415`, async function () {
        await tester.testCode(415);
        await tester.testTextBody(`This API only supports application/json media type.`);
      });
    });
    describe(`${testVariant} GET / 404`, function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/`, `GET`, acceptJson);
        await tester.fetch();
      });
      it(`should return status code 404`, async function () {
        await tester.testCode(404);
        await tester.testJsonBody({ "description": "Resource \"/\" not found." });
      });
    });
    describe(`${testVariant} GET /categories`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/categories`, `GET`, acceptJson);
        await tester.fetch();
      });
      it(`should return status code 200`, async function () {
        await tester.testCode(200);
      });
      it(`should return json array`, async function () {
        await tester.testJsonBody(
          function (json: { data: Array<CategoryFromDb> }) {
            assert.strictEqual(Array.isArray(json.data), true);
          }
        );
      });

      it(`should return categories`, async function () {
        await tester.testJsonBody(
          function (json: { data: Array<CategoryFromDb> }) {
            assert.strictEqual(json.data.length > 0, true);
          }
        );
      });
    });
    describe(`${testVariant} GET /products`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/products`, `GET`, acceptJson);
        await tester.fetch();
      });
      it(`should return status code 200`, async function () {
        await tester.testCode(200);
      });
      it(`should return json array`, async function () {
        await tester.testJsonBody(function (json: { data: Array<ProductAsInTheJson> }) {
          assert.strictEqual(Array.isArray(json.data), true);
        });
      });
      it(`should return products`, async function () {
        await tester.testJsonBody(function (json: { data: Array<ProductAsInTheJson> }) {
          assert.strictEqual(json.data.length > 0, true);
        });
      });
    });
    // E2E & Integration server tests repeat these test cases, we must ensure tests run on different products
    let testProductId = 0;
    describe(`${testVariant} POST /products 422`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/products`, `POST`, acceptContentJson, `{"rating":6}`);
        await tester.fetch();
      });
      it(`should return status code 422`, async function () {
        await tester.testCode(422);
      });
      it(`should return error json object`, async function () {
        await tester.testJsonBody(
          {
            description: `Invalid Product`,
            errors: {
              'product.code': 'Too short. Min length: 1.',
              'product.name': 'Too short. Min length: 1.',
              'product.description': 'Too short. Min length: 1.',
              'product.quantity': 'Too low. Min value: 0.',
              'product.price': 'Too low. Min value: 0.01.',
              'product.rating': 'Too high. Max value: 5.'
            }
          }
        );
      });
    });
    describe(`${testVariant} POST /products 409 ProductsCategories_id`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/products`, `POST`, acceptContentJson,
          JSON.stringify(
            {
              category: 20,
              code: `a`,
              name: `a`,
              description: `a`,
              quantity: 10,
              price: 10.1,
            }
          )
        );
        await tester.fetch();
      });
      let json: ValidationErrorStackJsonResponse;
      it(`should return status code 409`, async function () {
        await tester.testCode(409);
      });
      it(`should return error json object`, async function () {
        await tester.testJsonBody(
          {
            description: `Conflicting Product`,
            errors: {
              "product.categoryId": `Product Category does not exist.`
            }
          }
        );
      });
    });
    describe(`${testVariant} POST /products 409 code`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/products`, `POST`, acceptContentJson,
          JSON.stringify(
            {
              category: 2,
              code: `f230fh0g3`,
              name: `a`,
              description: `a`,
              quantity: 10,
              price: 10.1,
            }
          )
        );
        await tester.fetch();
      });
      let json: ValidationErrorStackJsonResponse;
      it(`should return status code 409`, async function () {
        await tester.testCode(409);
      });
      it(`should return error json object`, async function () {
        await tester.testJsonBody(
          {
            description: `Conflicting Product`,
            errors: {
              "product.code": `Duplicate value for code.`
            }
          }
        );
      });
    });
    describe(`${testVariant} POST /products 201`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/products`, `POST`, acceptContentJson,
          JSON.stringify(
            {
              category: 2,
              code: `abcdef-${testVariant}`,
              name: `a`,
              description: `a`,
              quantity: 10,
              price: 10.1,
            }
          )
        );
        await tester.fetch();
        await sleep(100);
      });
      it(`should return status code 201`, async function () {
        await tester.testCode(201);
      });
      it(`should return json object`, async function () {
        await tester.testJsonBody(async function (json: { data: ProductAsInTheJson }) {
          assert.ok(json.data.id > 1000);
          assert.strictEqual(json.data.code, `abcdef-${testVariant}`);
          testProductId = json.data.id;
        });
      });
    });
    describe(`${testVariant} GET /products/:id`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/products/${testProductId}`, `GET`, acceptJson
        );
        await tester.fetch();
      });
      it(`should return status code 200`, async function () {
        await tester.testCode(200);
      });
      it(`should return json object`, async function () {
        await tester.testJsonBody(async function (json: { data: ProductAsInTheJson }) {
          assert.strictEqual(json.data.id, testProductId);
        });
      });
    });
    describe(`${testVariant} GET /products/:id 400`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/products/0`, `GET`, acceptJson
        );
        await tester.fetch();
      });
      it(`should return status code 400`, async function () {
        await tester.testCode(400);
      });
    });
    describe(`${testVariant} GET /products/:id 404`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/products/999999`, `GET`, acceptJson
        );
        await tester.fetch();
      });
      it(`should return status code 404`, async function () {
        await tester.testCode(404);
      });
    });
    describe(`${testVariant} PATCH /products/:id 422 - validation`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/products/${testProductId}`, `PATCH`, acceptContentJson,
          `{"code":"${``.padEnd(256, `a`)}","image":"${``.padEnd(2049, `a`)}"}`
        );
        await tester.fetch();
      });
      it(`should return status code 422`, async function () {
        await tester.testCode(422);
      });
      it(`should return error json object`, async function () {
        await tester.testJsonBody({
          description: `Invalid Changes`,
          errors: {
            "product.code": `Too long. Max length: 255.`,
            "product.image": `Too long. Max length: 2048.`
          }
        });
      });
    });
    describe(`${testVariant} PATCH /products/:id 422 - no change`, async function () {
      let tester: ServerTester;
      before(async function () {
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
          "inventoryStatus": "INSTOCK"
        };
        tester = new TesterClass(`/products/${sourceValues.id}`, `PATCH`, acceptContentJson,
          JSON.stringify(sourceValues)
        );
        await tester.fetch();
      });
      it(`should return status code 422`, async function () {
        await tester.testCode(422);
      });
      it(`should return error json object`, async function () {
        await tester.testJsonBody(function(json:{description:string}){
          assert.strictEqual(json.description, `Expected changes.`);
        });
      });
    });
    describe(`${testVariant} PATCH /products/:id 409 - code exists`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/products/${testProductId}`, `PATCH`, acceptContentJson,
          `{"code":"nvklal433"}`, // code of 1001
        );
        await tester.fetch();
      });
      it(`should return status code 409`, async function () {
        await tester.testCode(409);
      });
      it(`should return error json object`, async function () {
        await tester.testJsonBody({
          description: `Conflicting Product`, errors: {
            "product.code": `Duplicate value for code.`
          }
        });
      });
    });
    describe(`${testVariant} PATCH /products/:id 409 - category does not exist`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/products/${testProductId}`, `PATCH`, acceptContentJson,
          `{"categoryId":9999}`,
        );
        await tester.fetch();
      });
      it(`should return status code 409`, async function () {
        await tester.testCode(409);
      });
      it(`should return error json object`, async function () {
        await tester.testJsonBody({
          description: `Conflicting Product`, errors: {
            "product.categoryId": `Product Category does not exist.`
          }
        });
      });
    });
    describe(`${testVariant} PATCH /products/:id 200`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/products/${testProductId}`, `PATCH`, acceptContentJson,
          `{"code":"abcd-${testVariant}","name":"product abcd","description":"product abcd desc","image":"abcd.png","category":"my category","categoryId":2,"price":125.25,"quantity":"5"}`
        );
        await tester.fetch();
      });
      it(`should return status code 200`, async function () {
        await tester.testCode(200);
      });
      it(`should return json object`, async function () {
        await tester.testJsonBody({
          data: {
            id: testProductId,
            code: `abcd-${testVariant}`,
            name: `product abcd`,
            description: `product abcd desc`,
            image: `abcd.png`,
            categoryId: 2,
            category: `Fitness`,
            price: 125.25,
            quantity: 5,
            inventoryStatus: `LOWSTOCK`,
            rating: 0
          }
        });
      });
    });
    describe(`${testVariant} DELETE /products/:id 404`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/products/999999`, `DELETE`, acceptJson
        );
        await tester.fetch();
      });
      it(`should return status code 404`, async function () {
        await tester.testCode(404);
      });
    });
    describe(`${testVariant} DELETE /products/:id 204`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/products/${testProductId}`, `DELETE`, acceptJson
        );
        await tester.fetch();
      });
      it(`should return status code 204`, async function () {
        await tester.testCode(204);
      });
      it(`should not return object`, async function () {
        await tester.testTextBody(``);
      });
    });
    describe(`${testVariant} Create -> Update -> List of unique products`, async function () {
      describe(`CUL Create product`, async function () {
        let tester: ServerTester;
        let prod: ProductAsInTheJson;
        before(async function () {
          tester = new TesterClass(`/products`, `POST`, acceptContentJson,
            JSON.stringify(
              {
                category: 3,
                code: `create-update-list-${testVariant}`,
                name: `create-update-list`,
                description: `tests create update list`,
                quantity: 10,
                price: 10.1,
              }
            )
          );
          await tester.fetch();
          await sleep(100);
        });
        it(`should return status code 201`, async function () {
          await tester.testCode(201);
          await tester.testJsonBody(async function (json: { data: ProductAsInTheJson }) {
            prod = json.data;
          });
        });

        describe(`CUL Update product`, async function () {
          let tester: ServerTester;
          before(async function () {
            await new Promise(r => setTimeout(r, 1000));
            tester = new TesterClass(`/products/${prod.id}`, `PATCH`, acceptContentJson,
              `{"price":20.2,"quantity":"20"}`
            );
            await tester.fetch();
          });
          it(`should return status code 200`, async function () {
            await tester.testCode(200);
          });

          describe(`CUL List products`, async function () {
            let tester: ServerTester;
            before(async function () {
              tester = new TesterClass(`/products`, `GET`, acceptJson);
              await tester.fetch();
            });
            it(`should return status code 200`, async function () {
              await tester.testCode(200);
            });
            it(`should not return duplicated products`, async function () {
              await tester.testJsonBody(function(json: { data: ProductAsInTheJson[] }){
                assert.strictEqual(json.data.filter(p => p.id === prod.id).length, 1);
              });
            });
          });
        });
      });
    });
    describe(`${testVariant} #62 Cannot set quantity to 0`, async function () {
      describe(`#62 Create product`, async function () {
        let tester: ServerTester;
        let prod: ProductAsInTheJson;
        before(async function () {
          tester = new TesterClass(`/products`, `POST`, acceptContentJson,
            JSON.stringify(
              {
                category: 3,
                code: `set-quantity-to-zero-${testVariant}`,
                name: `set-quantity-to-zero`,
                description: `tests set-quantity-to-zero`,
                quantity: 10,
                price: 10.1,
              }
            )
          );
          await tester.fetch();
          await sleep(100);
        });
        it(`should return status code 201`, async function () {
          await tester.testCode(201);
          await tester.testJsonBody(function(json: {data: ProductAsInTheJson}){
            prod = json.data;
          });
        });

        describe(`#62 Update product`, async function () {
          let tester: ServerTester;
          before(async function () {
            await new Promise(r => setTimeout(r, 1000));
            tester = new TesterClass(`/products/${prod.id}`, `PATCH`, acceptContentJson,
              `{"quantity":"0"}`,
            );
            await tester.fetch();
          });
          it(`should return status code 200`, async function () {
            await tester.testCode(200);
          });

          describe(`#62 Get product`, async function () {
            let tester: ServerTester;
            before(async function () {
              tester = new TesterClass(`/products/${prod.id}`, `GET`, acceptJson);
              await tester.fetch();
            });
            it(`should return status code 200`, async function () {
              await tester.testCode(200);
            });
            it(`should return product with qty = 0`, async function () {
              await tester.testJsonBody(function(json: { data: ProductAsInTheJson }){
                assert.strictEqual(json.data.quantity, 0);
              });
            });
          });
        });
      });
    });
  });

  describe(`Test API error endpoint (${testVariant})`, function () {
    let app: Express;
    before(async function () {
      app = await startServer({ skipListen: TesterClass.skipListen, skipRoutes: true });
      TesterClass.app = app;

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
    describe(`${testVariant} Error Handler`, async function () {
      let tester: ServerTester;
      before(async function () {
        tester = new TesterClass(`/error`, `GET`, acceptJson);
        await tester.fetch();
      });
      it(`should return status code 500`, async function () {
        await tester.testCode(500);
      });
      it(`should return message`, async function () {
        await tester.testJsonBody({"description":"Unexpected error. Please contact our support if the error persists."});
      });
    });
  });
}



