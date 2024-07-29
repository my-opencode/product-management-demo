import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ProductAsInTheJson } from "../models/product.types";
import { CategoryFromDb } from "../models/category";

/**
 * Type of the response from conn.execute for Category.list SELECT query
 */
export type DirectCategorySelectExecuteResponse = CategoryFromDb[];
/**
 * Type of the response from conn.execute for Product.list SELECT query
 */
export type DirectProductSelectExecuteResponse = ProductAsInTheJson[];
/**
 * Type of the response from conn.execute for any insert, update, delete query
 */
export type DirectInsertUpdateDeleteExecuteResponse = ResultSetHeader;
/**
 * Type of the return value of the new_product stored procedure
 */
export interface SpNewProductResult extends RowDataPacket {
  id: number;
}
/**
 * Type of the response from conn.execute for Product.insertNewInDatabase
 */
export type NewProductStoredProcedureExecuteResponse = [SpNewProductResult[],ResultSetHeader];
/**
 * Type of the response from conn.execute for Product.updateInDatabase
 */
export type UpdateProductStoredProcedureExecuteResponse = ResultSetHeader;