import Product from "../models/product";
import { InventoryStatus, ProductAsInTheJson } from "../models/product.types";
import { ProductDetailsJsonResponse } from "./json-response-format";

/**
 * Returns a JSON view of a Product
 * @param {Product | ProductAsInTheJson} product single product object
 * @returns {String}
 */
export default function renderer(product: (Product | ProductAsInTheJson)): string {
  const payload: ProductDetailsJsonResponse = {
    data: {
      id: product.id!,
      code: product.code,
      name: product.name,
      category: product.categoryName || product.category,
      categoryId: product.categoryId!,
      description: product.description,
      image: product.image || undefined,
      quantity: product.quantity,
      inventoryStatus: product.inventoryStatus as InventoryStatus,
      price: product.price,
      rating: product.rating || undefined
    }
  };
  return JSON.stringify(payload);
}