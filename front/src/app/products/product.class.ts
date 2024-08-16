export class Product {
  id?:number;
  code?:string;
  name?:string;
  description?:string;
  price?:number;
  quantity?:number;
  inventoryStatus?:string;
  category?:string;
  categoryId?:number;
  image?:string;
  rating?:number;
}

export interface ProductPayload {
  data: Product[];
  total?: number;
}
export interface ProductDetailsPayload {
  data: Product;
  total?: number;
}