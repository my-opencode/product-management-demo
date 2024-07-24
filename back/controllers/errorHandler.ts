import { NextFunction, Request, Response } from "express";
import Logger from "../lib/winston";
const logger = Logger(`controllers/error-handler`);
export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if(!err) return next();
  if (res.headersSent) {
    return next(err);
  }
  logger.log(`error`, `Caught error for ${req.method} "${req.url}" — ${err.message} — Trace: ${err.stack}`);
  res.status(500).send(`Unexpected error. Please contact our support if the error persists.`);
}
