import { NextFunction, Request, Response } from "express";
import Logger from "../lib/winston";
const logger = Logger(`ErrorHandler`);
export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }
  if(!err) return next();
  logger.log(`error`, `Caught error for ${req.method} "${req.url}" — ${err.message}`);
  res.status(500).send(`Unexpected error. Please contact our support if the error persists.`);
}
