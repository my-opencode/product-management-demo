import { RequestWithProduct } from "../types";
import { Response, NextFunction, Express, RequestHandler } from "express";
import objectToJSON from "../views/objectToJSON";
import Logger from "../lib/winston";
const logger = Logger(`controllers/products-get-one-by-id`);

export default async function productsGetOneById(request: RequestWithProduct, response: Response, next: NextFunction) {
  logger.log(`debug`, `Entering productsGetOneById`);
  try {
    if (!request.product) {
      response.status(404);
      return;
    }
    const payload = objectToJSON(request.product);
    logger.log(`debug`, `Exiting productsGetOneById`);
    response.status(200).set('Content-Type', 'application/json').send(payload);
  } catch (err) {
    logger.log(`warn`, `Error in productsGetOneById: ${err instanceof Error ? err.message : String(err)}`);
    next(err);
  }
}