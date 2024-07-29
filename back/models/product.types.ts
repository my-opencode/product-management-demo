import { RowDataPacket } from "mysql2";

export type InventoryStatus = "OUTOFSTOCK" | "LOWSTOCK" | "INSTOCK";

export interface ProductAsInTheJson extends RowDataPacket, ProductBase {
}

export interface ProductBase {
  id: number;
  code: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  categoryId: number;
  category: string;
  quantity: number;
  inventoryStatus: InventoryStatus;
  rating?: number;
}

export type UpdatableFieldKey = "category" | "code" | "name" | "description" | "image" | "price" | "quantity";