import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ProductAsInTheJson } from "../models/product";
import { CategoryFromDb } from "../models/category";
export type DirectCategorySelectExecuteResponse = CategoryFromDb[];
export type DirectProductSelectExecuteResponse = ProductAsInTheJson[];
// direct insert, update, delete
export type DirectInsertUpdateDeleteExecuteResponse = ResultSetHeader;
// stored procedure new_product
export interface SpNewProductResult extends RowDataPacket {
  id: number;
}
export type NewProductStoredProcedureExecuteResponse = [SpNewProductResult[],ResultSetHeader];
// stored procedure update_product
export type UpdateProductStoredProcedureExecuteResponse = ResultSetHeader;