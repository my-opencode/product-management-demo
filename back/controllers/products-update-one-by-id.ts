import { RequestWithProduct } from "../types";
import { Response, NextFunction } from "express";
import Logger from "../lib/winston";
import renderer from "../views/product-details";
import { ValidationError, ValidationErrorStack } from "../lib/validators";
const logger = Logger(`controllers/products-patch-update-one-by-id`, `debug`);

export default async function productsUpdateOneById(request: RequestWithProduct, response: Response, next: NextFunction) {
  logger.log(`debug`, `Entering`);
  try {
    if (!request.product) {
      response.status(404);
      logger.log(`debug`, `No product found.`);
      return;
    }
    const product = request.product;
    logger.log(`debug`, `Body: ${typeof request.body} "${JSON.stringify(request.body)}"`);
    // aggregate validation errors
    const validationErrors: ValidationError[] = [];
    const valErrHandler = (e: any) => {
      if (e instanceof ValidationError)
        validationErrors.push(e);
      else throw e;
    };
    // validate & set fields
    try { if (request.body?.code !== undefined) product.code = request.body.code; } catch (e) { valErrHandler(e); }
    try { if (request.body?.name !== undefined) product.name = request.body.name; } catch (e) { valErrHandler(e); }
    try { if (request.body?.description !== undefined) product.description = request.body.description; } catch (e) { valErrHandler(e); }
    try { if (request.body?.image !== undefined) product.image = request.body.image; } catch (e) { valErrHandler(e); }
    try { if (request.body?.categoryId !== undefined) product.category = request.body.categoryId; } catch (e) { valErrHandler(e); }
    try { if (request.body?.quantity !== undefined) product.quantity = request.body.quantity; } catch (e) { valErrHandler(e); }
    try { if (request.body?.price !== undefined) product.price = request.body.price; } catch (e) { valErrHandler(e); }
    // act on validation errors
    if (validationErrors.length) {
      logger.log(`debug`, `Update has invalid values.`);
      throw new ValidationErrorStack(validationErrors, `Invalid Changes`);
    }
    // exit if no change
    if (!product.isUpdated) {
      logger.log(`debug`, `Update yields no change.`);
      throw new ValidationError(`Expected changes.`);
    }
    logger.log(`debug`,`Ready to update fields: ${[...product.updatedFields].join(`, `)}`);
    await product.update(request.app);

    const payload = renderer(product);
    logger.log(`debug`, `Returning ${payload}`);
    response.status(200).send(payload);
  } catch (err) {
    if(err instanceof ValidationErrorStack && err.message === `Conflicting Product`)
        err.statusCode = 409;
    logger.log(`warn`, `Error in productsUpdateOneById: ${err instanceof Error ? err.message : String(err)}`);
    next(err);
  }
}