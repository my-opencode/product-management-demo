import { NextFunction, Request, Response } from "express";
import Logger from "../lib/winston";
import { ValidationError, ValidationErrorStack } from "../lib/validators";
import renderer from "../views/422-validation";
const logger = Logger(`controllers/validation-error-handler`, `debug`);
export default function validationErrorHandler(err: Error|ValidationError|ValidationErrorStack, req: Request, res: Response, next: NextFunction) {
  if(!err) return next();
  if (res.headersSent || !(err instanceof ValidationError || err instanceof ValidationErrorStack)) {
    return next(err);
  }
  logger.log(`debug`, `Caught validation error for ${req.method} "${req.url}" — ${err.message}`);
  res.status(err.statusCode || 422).send(renderer(err));
}
