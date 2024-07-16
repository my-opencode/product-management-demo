import { Response, Request, NextFunction, Express } from "express";
import Product from "../models/Products";
import objectToJSON from "../views/objectToJSON";
import Logger from "../lib/winston";
const logger = Logger(`controllers/products-get-all`);

export default async function productsGetAll(request: Request, response: Response, next: NextFunction) {
  logger.log(`debug`,`Entering productsGetAll`);
  try {
    const productList = await Product.listFromDatabase(request.app as Express);
    const payload = objectToJSON(productList);
    logger.log(`debug`,`Exiting productsGetAll`);
    response.status(200).send(payload);
  } catch(err){
    logger.log(`debug`,`Error in productsGetAll`);
    next(err);
  }
}