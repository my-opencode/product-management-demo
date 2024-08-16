import assert from "node:assert";
import { describe, it } from "node:test";
import { ProductAsInTheJson } from "../models/product.types";
import renderer from "./product-list";

describe(`Product details renderer`, function () {
  it(`should return string from ProductAsInTheJSON`, function () {
    assert.strictEqual(
      renderer([{
        id: 20,
        categoryId: 2,
        category: "my category",
        code: `a`,
        name: `a`,
        description: `a`,
        quantity: 10,
        price: 10.1,
        inventoryStatus: "INSTOCK"
      }] as ProductAsInTheJson[]),
      `{"data":[{"id":20,"code":"a","name":"a","category":"my category","categoryId":2,"description":"a","quantity":10,"inventoryStatus":"INSTOCK","price":10.1,"rating":0}]}`
    );
  });
});