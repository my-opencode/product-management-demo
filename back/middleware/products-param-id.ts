import { NextFunction, Response, RequestParamHandler } from "express";
import { RequestWithProduct } from "../types";
import Product from "../models/Products";

/**
 * Express Application.param middleware.
 * Retrieves Product from DB by ID.
 * Sets Request.product
 * @param {RequestWithProduct} req request object
 * @param {Response} res response object
 * @param {NextFunction} next next function
 * @param {String} val value of the id parameter
 * @param {String} param name of the id paramater
 */
async function productsParamMwGetProductById (req:RequestWithProduct, res:Response, next:NextFunction, val:string|number, param:string) {
  if(!req.id)
    return next(new Error(`Missing product id.`));
  try {
    req.product = await Product.getById(req.app, req.id);
    if(!req.product){
      return res.status(404).send();
    }
    next();
  } catch(err){
    next(err);
  }
}

export default productsParamMwGetProductById as RequestParamHandler;