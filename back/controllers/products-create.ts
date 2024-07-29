import { Response, NextFunction, Request } from "express";
import Logger from "../lib/winston";
import Product from "../models/product";
import renderer from "../views/product-details";
const logger = Logger(`controllers/products-post-create`, `debug`);
import { ValidationErrorStack } from "../lib/validators";

export default async function productsCreate(request: Request, response: Response, next: NextFunction) {
  logger.log(`verbose`, `Entering`);
  try {
    logger.log(`debug`, `Body: ${typeof request.body} "${JSON.stringify(request.body)}"`);
    const product = new Product(request.body);
    await product.save(request.app);
    const payload = renderer(product);
    logger.log(`debug`, `Payload ${payload}`);
    logger.log(`verbose`, `Exiting`);
    response.status(201).send(payload);
  } catch (err) {
    if(err instanceof ValidationErrorStack && err.message === `Conflicting Product`)
        err.statusCode = 409;
    logger.log(`warn`, `Error: ${err instanceof Error ? err.message : String(err)}`);
    next(err);
  }
}