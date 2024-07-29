import { Response, Request, NextFunction, Express } from "express";
import Category from "../models/category";
import Logger from "../lib/winston";
import renderer from "../views/category-list";
const logger = Logger(`controllers/categories-get-all`);

export default async function categoriesGetAll(request: Request, response: Response, next: NextFunction) {
  logger.log(`debug`,`Entering categoriesGetAll`);
  try {
    const productList = await Category.list(request.app as Express);
    const payload = renderer(productList);
    logger.log(`debug`,`Exiting categoriesGetAll`);
    response.status(200).send(payload);
  } catch(err){
    logger.log(`debug`,`Error in categoriesGetAll`);
    next(err);
  }
}