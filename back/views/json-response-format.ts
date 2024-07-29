import { CategoryBase } from "../models/category";
import { ProductBase } from "../models/product";

/**
 * Type of the list of validation error fields in a Validation Error JSON response payload
 */
export interface ValidationFieldErrors {
  [fieldName:string]:string;
}
/**
 * Type of a Validation Error JSON response payload
 */
export interface ValidationErrorStackJsonResponse {
  description?:string;
  errors: ValidationFieldErrors;
}
/**
 * Type of an Error JSON response payload
 */
export interface ErrorJsonResponse {
  description:string;
  errors?: ValidationFieldErrors;
}
/**
 * Type of a Category list JSON response payload
 */
export interface CategoryListJsonResponse {
  data: CategoryBase[];
}
/**
 * Type of a Product list JSON response payload
 */
export interface ProductListJsonResponse {
  data: ProductBase[];
}
/**
 * Type of a Product details JSON response payload
 */
export interface ProductDetailsJsonResponse {
  data: ProductBase;
}