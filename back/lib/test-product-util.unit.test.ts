import assert from "node:assert";
import { before, describe, it } from "node:test";
import { getDummyProduct, randomStr } from "./test-product-util";
import Product from "../models/product";

describe.skip(`randomStr`, function () {
  it(`should return string`, function () {
    for (let i = 9999; i > 0; i--) {
      const s = randomStr();
      assert.ok(typeof s === `string`);
      assert.ok(s.length < 255, `Expected length below 255, got ${s.length}.`);
      assert.ok(s.length > 9, `Expected length above 9, got ${s.length}.`);
    }
  });
});

describe(`getDummyProduct`, function () {
  describe(`no argument`, function () {
    let p: Product;
    before(function () {
      p = getDummyProduct();
    });
    it(`should return product`, function () {
      assert.ok(p instanceof Product);
    });
    it(`should not be saved`, function () {
      assert.strictEqual(p.isSaved, false);
    });
    it(`should not be readOnly`, function () {
      assert.strictEqual(p.isReadOnly, false);
    });
    it(`should not be updated`, function () {
      assert.strictEqual(p.isUpdated, false);
    });
    it(`should have valid rating`, function () {
      assert.ok([0, 1, 2, 3, 4, 5].includes(p.rating));
    });
  });
  describe.skip(`valid ratings`, function () {
    it(`should have valid rating`, function () {
      for (let i = 9999; i > 0; i--) {
        const p = getDummyProduct();
        assert.ok([0, 1, 2, 3, 4, 5].includes(p.rating));
      }
    });
  });

  describe(`isSaved`, function () {
    let p: Product;
    before(function () {
      p = getDummyProduct({ isSaved: true });
    });
    it(`should return product`, function () {
      assert.ok(p instanceof Product);
    });
    it(`should be saved`, function () {
      assert.strictEqual(p.isSaved, true);
    });
    it(`should not be readOnly`, function () {
      assert.strictEqual(p.isReadOnly, false);
    });
    it(`should not be updated`, function () {
      assert.strictEqual(p.isUpdated, false);
    });
  });

  describe(`isReadOnly`, function () {
    let p: Product;
    before(function () {
      p = getDummyProduct({ isReadOnly: true });
    });
    it(`should return product`, function () {
      assert.ok(p instanceof Product);
    });
    it(`should not be saved`, function () {
      assert.strictEqual(p.isSaved, false);
    });
    it(`should be readOnly`, function () {
      assert.strictEqual(p.isReadOnly, true);
    });
    it(`should not be updated`, function () {
      assert.strictEqual(p.isUpdated, false);
    });
  });

  describe(`isUpdated`, function () {
    let p: Product;
    before(function () {
      p = getDummyProduct({ isUpdated: true });
    });
    it(`should return product`, function () {
      assert.ok(p instanceof Product);
    });
    it(`should be saved`, function () {
      assert.strictEqual(p.isSaved, true);
    });
    it(`should not be readOnly`, function () {
      assert.strictEqual(p.isReadOnly, false);
    });
    it(`should be updated`, function () {
      assert.strictEqual(p.isUpdated, true);
    });
  });

  describe(`isSaved + isReadOnly`, function () {
    let p: Product;
    before(function () {
      p = getDummyProduct({ isReadOnly: true, isSaved: true });
    });
    it(`should return product`, function () {
      assert.ok(p instanceof Product);
    });
    it(`should be saved`, function () {
      assert.strictEqual(p.isSaved, true);
    });
    it(`should be readOnly`, function () {
      assert.strictEqual(p.isReadOnly, true);
    });
    it(`should not be updated`, function () {
      assert.strictEqual(p.isUpdated, false);
    });
  });
});