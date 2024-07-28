import Product, { ProductAsInTheJson } from "../models/product";

export default function renderer(products:(Product|ProductAsInTheJson)[]):string{
  return JSON.stringify({
    data: products.map(
      p => ({
        id: p.id,
        code: p.code,
        name: p.name,
        category: p.categoryName || p.category,
        categoryId: p.categoryId,
        description: p.description,
        image: p.image || undefined,
        quantity: p.quantity,
        inventoryStatus: p.inventoryStatus || undefined,
        price: p.price,
        rating: p.rating || undefined
      })
    )
  });
}