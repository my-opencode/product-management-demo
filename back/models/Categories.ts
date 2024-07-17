import { RowDataPacket } from "mysql2";
import { RichApp } from "../types";
import AppSymbols from "../AppSymbols";

export interface CategoryFromDb extends RowDataPacket {
  id: number;
  name: string;
}

export class Category {
  static async list(app:RichApp){
    return await this.listFromDatabase(app);
  }
  static async listFromDatabase(app:RichApp){
    const pool = app.get(AppSymbols.connectionPool);
    const [rows] = await pool.execute(`SELECT id, name FROM ProductCategories;`);
    return rows as CategoryFromDb[];
  }
}

export default Category;