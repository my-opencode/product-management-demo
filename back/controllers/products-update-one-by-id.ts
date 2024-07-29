import { RequestWithProduct } from "../types";
import { Response, NextFunction } from "express";
import Logger from "../lib/winston";
import renderer from "../views/product-details";
import { ValidationError, ValidationErrorStack } from "../lib/validators";
const logger = Logger(`controllers/products-patch-update-one-by-id`, `debug`);

/**
 * PATCH /products/:id controller
 * Sends a {"data":ProductAsInJson} response.
 * @param {Request} request Express request object
 * @param {Response} response Express response object
 * @param {NextFunction} next Express next function
 */
export default async function productsUpdateOneById(request: RequestWithProduct, response: Response, next: NextFunction) {
  logger.log(`verbose`, `Entering`);
  try {
    if (!request.product) {
      response.status(404);
      logger.log(`warn`, `Product is not defined on request.`);
      // return response.status(404);
      return;
    }
    logger.log(`debug`, `Body: ${typeof request.body} "${JSON.stringify(request.body)}"`);
    // aggregate validation errors
    const validationErrors: ValidationError[] = [];
    const valErrHandler = (e: any) => {
      if (e instanceof ValidationError)
        validationErrors.push(e);
      else throw e;
    };
    // validate & set fields
    const product = request.product;
    try { if (request.body?.code !== undefined) product.code = request.body.code; } catch (e) { valErrHandler(e); }
    try { if (request.body?.name !== undefined) product.name = request.body.name; } catch (e) { valErrHandler(e); }
    try { if (request.body?.description !== undefined) product.description = request.body.description; } catch (e) { valErrHandler(e); }
    try { if (request.body?.image !== undefined) product.image = request.body.image; } catch (e) { valErrHandler(e); }
    try { if (request.body?.categoryId !== undefined) product.category = request.body.categoryId; } catch (e) { valErrHandler(e); }
    try { if (request.body?.quantity !== undefined) product.quantity = request.body.quantity; } catch (e) { valErrHandler(e); }
    try { if (request.body?.price !== undefined) product.price = request.body.price; } catch (e) { valErrHandler(e); }
    // act on validation errors
    if (validationErrors.length) {
      logger.log(`verbose`, `Update has invalid values.`);
      logger.log(`debug`, validationErrors);
      throw new ValidationErrorStack(validationErrors, `Invalid Changes`);
    }
    // exit if no change
    if (!product.isUpdated) {
      logger.log(`verbose`, `No change on product.`);
      throw new ValidationError(`Expected changes.`);
    }
    logger.log(`debug`,`Ready to update fields: ${[...product.updatedFields].join(`, `)}`);
    logger.log(`verbose`, `Updating`);
    await product.update(request.app);

    const payload = renderer(product);
    logger.log(`debug`, `Payload: ${payload}`);
    logger.log(`verbose`, `Exiting`);
    response.status(200).send(payload);
  } catch (err) {
    if(err instanceof ValidationErrorStack && err.message === `Conflicting Product`)
        err.statusCode = 409;
    logger.log(`warn`, `Error: ${err instanceof Error ? err.message : String(err)}`);
    next(err);
  }
}