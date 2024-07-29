import { RequestWithProduct } from "../types";
import { Response, NextFunction } from "express";
import Logger from "../lib/winston";
const logger = Logger(`controllers/products-delete-delete-one-by-id`, `debug`);

export default async function productsDeleteOneById(request: RequestWithProduct, response: Response, next: NextFunction) {
  logger.log(`verbose`, `Entering`);
  try {
    if (!request.product) {
      response.status(404);
      logger.log(`warn`, `Product is not defined on request.`);
      return;
    }

    logger.log(`verbose`, `Deleting`);
    await request.product.delete(request.app);

    logger.log(`verbose`, `Exiting`);
    response.status(204).send();
  } catch (err) {
    logger.log(`warn`, `Error: ${err instanceof Error ? err.message : String(err)}`);
    next(err);
  }
}