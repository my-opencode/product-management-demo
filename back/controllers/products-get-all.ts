import { Response, Request, NextFunction, Express } from "express";
import Product from "../models/Products";
import Logger from "../lib/winston";
import renderer from "../views/product-list";
const logger = Logger(`controllers/products-get-all`, `debug`);

export default async function productsGetAll(request: Request, response: Response, next: NextFunction) {
  logger.log(`debug`,`Entering`);
  try {
    const productList = await Product.list(request.app as Express);
    const payload = renderer(productList);
    logger.log(`debug`,`Returning ${payload}`);
    response.status(200).set('Content-Type', 'application/json').send(payload);
  } catch(err){
    logger.log(`debug`,`Error in productsGetAll: ${err instanceof Error ? err.message : String(err)}`);
    next(err);
  }
}