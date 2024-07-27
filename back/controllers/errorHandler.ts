import { NextFunction, Request, Response } from "express";
import Logger from "../lib/winston";
const logger = Logger(`controllers/error-handler`);
export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if(!err) return next();
  if (res.headersSent) {
    return next(err);
  }
  const message = `Unexpected error. Please contact our support if the error persists.`;
  logger.log(`error`, `Caught error for ${req.method} "${req.url}" — \n${err.message} — \nTrace: ${err.stack}`);
  // todo move to view
  if(req.headers?.accept === `application/json`)
    res.status(500).set(`Accept`,`application/json`).send(`{"description":"${message}",errors:[]}`);
  else
    res.status(500).send(message);
}
