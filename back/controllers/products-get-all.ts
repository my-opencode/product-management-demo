import { Response, Request, NextFunction, Express } from "express";
import Product from "../models/Products";
import objectToJSON from "../views/objectToJSON";

export default async function productsGetAll(request: Request, response: Response, next: NextFunction) {
  try {
    const productList = await Product.listFromDatabase(request.app as Express);
    const payload = objectToJSON(productList);
    response.status(200).json(payload);
  } catch(err){
    next(err);
  }
}