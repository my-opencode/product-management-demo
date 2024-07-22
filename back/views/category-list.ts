import { CategoryFromDb } from "../models/Categories";

export default function renderer(categories: (CategoryFromDb)[]): string {
  return JSON.stringify({
    data: categories.map(
      category => ({
        id: category.id,
        name: category.name,
      })
    )
  });
}