import { NextFunction, Response, Request } from "express";
import { RequestWithId } from "../types";
import Id from "../models/Id";

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
export function paramValidatorMwId (req:RequestWithId, res:Response, next:NextFunction, val:string|number, param:string) {
  try {
    req.id = Id.validator(val, `Invalid URL parameter 'id'. Expected integer.`);
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
    req.params[param] = String(req.id);
    next();
  } catch(err){
    if (err instanceof TypeError)
      res.status(400).send(err.message);
    else
      next(err);
  }
}

export default paramValidatorMwId;