import { Response, Request, NextFunction, Express } from "express";
import Category from "../models/category";
import Logger from "../lib/winston";
import renderer from "../views/category-list";
const logger = Logger(`controllers/categories-get-all`);

/**
 * GET /categories controller
 * Sends a {"data":Category[]} response.
 * @param {Request} request Express request object
 * @param {Response} response Express response object
 * @param {NextFunction} next Express next function
 */
export default async function categoriesGetAll(request: Request, response: Response, next: NextFunction) {
  logger.log(`verbose`,`Entering`);
  try {
    const productList = await Category.list(request.app as Express);
    const payload = renderer(productList);
    logger.log(`debug`,payload);
    logger.log(`verbose`,`Exiting`);
    response.status(200).send(payload);
  } catch(err){
    logger.log(`error`,err instanceof Error ? err.message : err);
    logger.log(`debug`,err instanceof Error ? err.stack : `no stack`);
    next(err);
  }
}