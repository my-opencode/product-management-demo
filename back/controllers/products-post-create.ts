import { Response, NextFunction, Request } from "express";
import Logger from "../lib/winston";
import Product from "../models/Products";
import renderer from "../views/product-details";
const logger = Logger(`controllers/products-post-create`, `debug`);
import {QueryError} from "mysql2";
import { ValidationError, ValidationErrorStack } from "../lib/validators";

export default async function productsCreate(request: Request, response: Response, next: NextFunction) {
  logger.log(`debug`, `Entering`);
  try {
    logger.log(`debug`, `Body: ${typeof request.body} "${JSON.stringify(request.body)}"`);
    const product = new Product(request.body);
    await product.save(request.app);
    const payload = renderer(product);
    logger.log(`debug`, `Exiting`);
    response.status(201).set('Content-Type', 'application/json').send(payload);
  } catch (err) {
    if(err instanceof ValidationErrorStack && err.message === `Conflicting Product`)
        err.statusCode = 409;
    logger.log(`warn`, `Error: ${err}`);
    next(err);
  }
}