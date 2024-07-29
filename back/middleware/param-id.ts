import { NextFunction, Response } from "express";
import { RequestWithId } from "../types";
import Id from "../models/id";
import { ValidationError } from "../lib/validators";
import Logger from "../lib/winston";
const logger = Logger(`middleware/param-id`, `debug`);

/**
 * Express Application.param middleware.
 * Validates the id URL parameter.
 * Sets Request.id.
 * Mutates Request.params[param].
 * @param {RequestWithId} req request object
 * @param {Response} res response object
 * @param {NextFunction} next next function
 * @param {String} val value of the id parameter
 * @param {String} param name of the id paramater
 */
export function paramValidatorMwId(req: RequestWithId, res: Response, next: NextFunction, val: string | number, param: string) {
  logger.log(`verbose`, `Entering`);
  try {
    logger.log(`debug`, `Route "${req.url}" with parameter :id = ${val}.`);
    req.id =  new Id(Id.validator(val, `Invalid URL parameter 'id'. Expected integer.`));
    /**
     * Express Doc recommends using app.param to alter route param values:
     * https://expressjs.com/en/4x/api.html#req.params
     * > If you need to make changes to a key in req.params, use the app.param handler. 
     * > Changes are applicable only to parameters already defined in the route path.
     * 
     * Based on source
     * express version 4.19.2
     * express/lib/router/index.js
     * line 371
     * paramVal = req.params[name]
     */
    logger.log(`debug`, `Setting req.id = ${req.id} on Route "${req.url}"`);
    req.params[param] = String(req.id);
    logger.log(`verbose`, `Exiting`);
    next();
  } catch (err) {
    if (err instanceof ValidationError) {
      logger.log(`debug`, `Invalid :id parameter on route "${req.url}".`);
      res.status(400).send(err.message);
    } else {
      logger.log(`warn`, `Unexpected error validating :id parameter on route "${req.url}".`);
      next(err);
    }
  }
}

export default paramValidatorMwId;