import { NextFunction, Request, Response } from "express";
import Logger from "../lib/winston";
import { ValidationError, ValidationErrorStack } from "../lib/validators";
import renderer from "../views/422-validation";
const logger = Logger(`controllers/validation-error-handler`);

/**
 * validation error controller
 * Sends a {"description":string,"errors":{[fieldName:string]:string}[]} object response.
 * @param {Request} request Express request object
 * @param {Response} response Express response object
 * @param {NextFunction} next Express next function
 */
export default function validationErrorHandler(err: Error|ValidationError|ValidationErrorStack, req: Request, res: Response, next: NextFunction) {
  logger.log(`verbose`, `Entering`);
  if(!err) return next();
  if (res.headersSent || !(err instanceof ValidationError || err instanceof ValidationErrorStack)) {
    return next(err);
  }
  logger.log(`debug`, `Caught validation error for ${req.method} "${req.url}" — ${err.message}`);
  logger.log(`verbose`, `Exiting`);
  res.status(err.statusCode || 422).send(renderer(err));
}
