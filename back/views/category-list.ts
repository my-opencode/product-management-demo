import { CategoryFromDb } from "../models/category";
import { CategoryListJsonResponse } from "./json-response-format";

/**
 * Returns a JSON view of a list of categories
 * @param {CategoryFromDb[]} categories array of categories
 * @returns {String}
 */
export default function renderer(categories: CategoryFromDb[]): string {
  const payload: CategoryListJsonResponse = {
    data: categories.map(
      category => ({
        id: category.id,
        name: category.name,
      })
    )
  };
  return JSON.stringify(payload);
}