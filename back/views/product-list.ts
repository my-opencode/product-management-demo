import Product from "../models/product";
import { InventoryStatus, ProductBase } from "../models/product.types";
import { ProductListJsonResponse } from "./json-response-format";

/**
 * Returns a JSON view of a list of products
 * @param {Product | ProductBase} products array of products
 * @returns {String}
 */
export default function renderer(products:(Product|ProductBase)[]):string{
  const payload : ProductListJsonResponse = {
    data: products.map(
      p => ({
        id: p.id!,
        code: p.code,
        name: p.name,
        category: p instanceof Product ? p.categoryName : p.category,
        categoryId: p.categoryId!,
        description: p.description,
        image: p.image || undefined,
        quantity: p.quantity,
        inventoryStatus: p.inventoryStatus as InventoryStatus,
        price: p.price,
        rating: p.rating || undefined
      })
    )
  };
  return JSON.stringify(payload);
}