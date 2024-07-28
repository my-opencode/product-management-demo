import { RequestWithProduct } from "../types";
import { Response, NextFunction } from "express";
import Logger from "../lib/winston";
const logger = Logger(`controllers/products-delete-delete-one-by-id`, `debug`);

export default async function productsDeleteOneById(request: RequestWithProduct, response: Response, next: NextFunction) {
  logger.log(`debug`, `Entering`);
  try {
    if (!request.product) {
      response.status(404);
      logger.log(`debug`, `No product found.`);
      return;
    }
    const product = request.product;
    await product.delete(request.app);

    response.status(204).send();
  } catch (err) {
    logger.log(`warn`, `Error in productsDeleteOneByID: ${err instanceof Error ? err.message : String(err)}`);
    next(err);
  }
}