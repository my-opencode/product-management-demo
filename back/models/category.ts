import { RowDataPacket } from "mysql2";
import { RichApp } from "../types";
import AppSymbols from "../AppSymbols";
import { DirectCategorySelectExecuteResponse } from "../database/adapter-response-format";

export interface CategoryBase {
  id: number;
  name: string;
}

export interface CategoryFromDb extends RowDataPacket, CategoryBase { }
export class Category {
  static async list(app:RichApp){
    return await this.listFromDatabase(app);
  }
  static async listFromDatabase(app:RichApp){
    const pool = app.get(AppSymbols.connectionPool);
    const [rows] = await pool.execute<DirectCategorySelectExecuteResponse>(`SELECT id, name FROM ProductCategories;`);
    return rows;
  }
}

export default Category;