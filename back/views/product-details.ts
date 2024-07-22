import Product, { ProductAsInTheJson, ProductBase } from "../models/Products";

export default function renderer(product: (Product | ProductAsInTheJson)): string {
  return JSON.stringify({
    data: {
      id: product.id,
      code: product.code,
      name: product.name,
      category: product.categoryName || product.category,
      description: product.description,
      image: product.image || undefined,
      quantity: product.quantity,
      inventoryStatus: product.inventoryStatus || undefined,
      price: product.price,
      rating: product.rating || undefined
    }
  });
}