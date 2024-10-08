import { RequestWithProduct } from "../types";
import { Response, NextFunction } from "express";
import Logger from "../lib/winston";
import renderer from "../views/product-details";
const logger = Logger(`controllers/products-get-one-by-id`);

/**
 * GET /products/:id controller
 * Sends a {"data":ProductAsInJson} response.
 * @param {Request} request Express request object
 * @param {Response} response Express response object
 * @param {NextFunction} next Express next function
 */
export default async function productsGetOneById(request: RequestWithProduct, response: Response, next: NextFunction) {

  logger.log(`verbose`, `Entering`);
  try {
    if (!request.product) {
      response.status(404);
      return;
    }
    const payload = renderer(request.product);
    logger.log(`debug`, `Payload: ${payload}`);
    logger.log(`verbose`, `Exiting`);
    logger.log(`debug`, `Returning ${payload}`);
    response.status(200).send(payload);
  } catch (err) {
    logger.log(`warn`, `Error: ${err instanceof Error ? err.message : String(err)}`);
    next(err);
  }
}