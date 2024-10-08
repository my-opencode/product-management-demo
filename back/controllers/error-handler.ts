import { NextFunction, Request, Response } from "express";
import Logger from "../lib/winston";
import renderer from "../views/generic-error";
const logger = Logger(`controllers/error-handler`);

/**
 * Error controller
 * Does not handler 404 errors.
 * Supports application/json and text responses.
 * Sends a {"description":String, "errors":{[fieldName:string]:string}[]} object.
 * @param {Request} request Express request object
 * @param {Response} response Express response object
 * @param {NextFunction} next Express next function
 */
export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (!err) return next();
  const message = `Unexpected error. Please contact our support if the error persists.`;
  logger.log(`verbose`, `Entering`);
  logger.log(`error`, `Caught error for ${req.method} "${req.url}" — \n${err.message} — \nTrace: ${err.stack}`);
  if (res.headersSent) {
    logger.log(`debug`, `Headers were sent`);
    logger.log(`verbose`, `Exiting without status`);
    return res.send(message);
  }
  logger.log(`verbose`, `Exiting`);
  res.status(500).send(renderer(message));
}
