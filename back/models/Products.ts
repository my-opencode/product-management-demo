import { RowDataPacket } from "mysql2";
import { RichApp } from "../types";
import AppSymbols from "../AppSymbols";

export interface ProductAsInTheJson extends RowDataPacket {
  id: number;
  code: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  category: number;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

export class Product {
  static async list(app:RichApp){
    return await this.listFromDatabase(app);
  }
  static async listFromDatabase(app:RichApp){
    const pool = app.get(AppSymbols.connectionPool);
    const [rows] = await pool.execute(`SELECT 
      p.id, 
      p.code, 
      p.name, 
      p.description, 
      p.image, 
      ProductCategories.name as category, 
      prices.price, 
      ratings.rating, 
      inventory.quantity, 
      inventory.inventory_status AS inventoryStatus 
FROM \`Products\`  AS p
LEFT JOIN ProductCategories ON p.Category_id = ProductCategories.id
RIGHT JOIN (
	SELECT Product_id, price ,
    RANK() OVER (PARTITION BY Product_id ORDER BY date_start DESC) date_rank
    FROM ProductsPrices WHERE date_start <= NOW()
) AS prices ON p.id = prices.Product_id 
RIGHT JOIN (
	SELECT Product_id, rating,
    RANK() OVER (PARTITION BY Product_id ORDER BY date DESC) rating_rank
    FROM ProductsRatings
) AS ratings ON p.id = ratings.Product_id 
RIGHT JOIN (
	SELECT Product_id, quantity, inventory_status,
    RANK() OVER (PARTITION BY Product_id ORDER BY date DESC) inv_rank
    FROM ProductsInventory
) AS inventory ON p.id = inventory.Product_id 
WHERE deleted = 0;`);
    return rows as ProductAsInTheJson[];
  }
  static async getById(app:RichApp, id:number){
    return await this.getFromDatabaseById(app, id);
  }
  static async getFromDatabaseById(app:RichApp, id:number):Promise<ProductAsInTheJson|undefined>{
    const pool = app.get(AppSymbols.connectionPool);
    const [rows] = await pool.execute(`SELECT 
      p.id, 
      p.code, 
      p.name, 
      p.description, 
      p.image, 
      ProductCategories.name as category, 
      prices.price, 
      ratings.rating, 
      inventory.quantity, 
      inventory.inventory_status AS inventoryStatus 
FROM \`Products\`  AS p
LEFT JOIN ProductCategories ON p.Category_id = ProductCategories.id
RIGHT JOIN (
	SELECT Product_id, price ,
    RANK() OVER (PARTITION BY Product_id ORDER BY date_start DESC) date_rank
    FROM ProductsPrices WHERE date_start <= NOW()
) AS prices ON p.id = prices.Product_id 
RIGHT JOIN (
	SELECT Product_id, rating,
    RANK() OVER (PARTITION BY Product_id ORDER BY date DESC) rating_rank
    FROM ProductsRatings
) AS ratings ON p.id = ratings.Product_id 
RIGHT JOIN (
	SELECT Product_id, quantity, inventory_status,
    RANK() OVER (PARTITION BY Product_id ORDER BY date DESC) inv_rank
    FROM ProductsInventory
) AS inventory ON p.id = inventory.Product_id 
WHERE deleted = 0 AND p.id = ${id} LIMIT 1;`);
    return (rows as ProductAsInTheJson[])[0];
  }
}

export default Product;