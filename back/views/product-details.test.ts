import assert from "node:assert";
import { describe, it } from "node:test";
import renderer from "./product-details";
import Product, { ProductAsInTheJson } from "../models/Products";

describe(`Product details renderer`, function () {
  it(`should return string from ProductAsInTheJSON`, function () {
    assert.strictEqual(
      renderer({
          id: 20,
          category: 2,
          code: `a`,
          name: `a`,
          description: `a`,
          quantity: 10,
          price: 10.1,
          inventoryStatus:"INSTOCK"
        } as ProductAsInTheJson),
      `{"data":{"id":20,"code":"a","name":"a","category":2,"description":"a","quantity":10,"inventoryStatus":"INSTOCK","price":10.1}}`
    );
  });
  it(`should return string from Product (category id)`, function () {
    assert.strictEqual(
      renderer(
        new Product({
          id: 20,
          category: 2,
          code: `a`,
          name: `a`,
          description: `a`,
          quantity: 10,
          price: 10.1,
        })),
      `{"data":{"id":20,"code":"a","name":"a","category":2,"description":"a","quantity":10,"price":10.1}}`
    );
  });
  it(`should return string from Product (category name)`, function () {
    const p = new Product({
      id: 20,
      category: 2,
      code: `a`,
      name: `a`,
      description: `a`,
      quantity: 10,
      price: 10.1,
    });
    p.categoryName = `my category`
    assert.strictEqual(
      renderer(p),
      `{"data":{"id":20,"code":"a","name":"a","category":"my category","description":"a","quantity":10,"price":10.1}}`
    );
  });
});