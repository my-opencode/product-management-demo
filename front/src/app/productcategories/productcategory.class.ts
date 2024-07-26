export class ProductCategory {
  id:number;
  name:string;
}

export interface ProductCategoryPayload {
  data: ProductCategory[];
  total?: number
}