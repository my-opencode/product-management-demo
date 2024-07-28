import { NextFunction, Response, RequestParamHandler } from "express";
import { RequestWithProduct } from "../types";
import Product from "../models/product";
import { ValidationError } from "../lib/validators";
import Logger from "../lib/winston";
const logger = Logger(`middleware/products-param-id`, `debug`);
/**
 * Express Application.param middleware.
 * Retrieves Product from DB by ID.
 * Sets Request.product
 * @param {RequestWithProduct} req request object
 * @param {Response} res response object
 * @param {NextFunction} next next function
 * @param {String} val value of the id parameter
 * @param {String} param name of the id paramater
 */
async function productsParamMwGetProductById(req: RequestWithProduct, res: Response, next: NextFunction, val: string | number, param: string) {
  if (!req.id) {
    logger.log(`debug`, `Did not receive req.id on route "${req.url}".`);
    return next(new ValidationError(`Missing product id.`, `/products/{id}`, 400));
  }
  try {
    req.product = await Product.getById(req.app, req.id);
    if (!req.product) {
      logger.log(`debug`, `Did not find product for req.id = ${req.id} on route "${req.url}".`);
      return res.status(404).send();
    }
    next();
  } catch (err) {
    logger.log(`debug`, `Unexpected error searching product with id ${req.id} on route "${req.url}".`);
    next(err);
  }
}

export default productsParamMwGetProductById as RequestParamHandler;