import { RequestWithProduct } from "../types";
import { Response, NextFunction } from "express";
import Logger from "../lib/winston";
import renderer from "../views/product-details";
const logger = Logger(`controllers/products-get-one-by-id`, `debug`);

export default async function productsGetOneById(request: RequestWithProduct, response: Response, next: NextFunction) {
  logger.log(`debug`, `Entering`);
  try {
    if (!request.product) {
      response.status(404);
      return;
    }
    const payload = renderer(request.product);
    logger.log(`debug`, `Returning ${payload}`);
    response.status(200).set('Content-Type', 'application/json').send(payload);
  } catch (err) {
    logger.log(`warn`, `Error in productsGetOneById: ${err instanceof Error ? err.message : String(err)}`);
    next(err);
  }
}