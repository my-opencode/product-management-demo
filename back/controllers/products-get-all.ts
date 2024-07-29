import { Response, Request, NextFunction, Express } from "express";
import Product from "../models/product";
import Logger from "../lib/winston";
import renderer from "../views/product-list";
const logger = Logger(`controllers/products-get-all`, `debug`);

/**
 * GET /products controller
 * Sends a {"data":ProductAsInJson[]} response.
 * @param {Request} request Express request object
 * @param {Response} response Express response object
 * @param {NextFunction} next Express next function
 */
export default async function productsGetAll(request: Request, response: Response, next: NextFunction) {
  logger.log(`verbose`, `Entering`);
  try {
    const productList = await Product.list(request.app as Express);
    const payload = renderer(productList);
    logger.log(`debug`,`Payload: ${productList.length} products`);
    logger.log(`verbose`, `Exiting`);
    response.status(200).send(payload);
  } catch(err){
    logger.log(`error`,`Error: ${err instanceof Error ? err.message : String(err)}`);
    next(err);
  }
}