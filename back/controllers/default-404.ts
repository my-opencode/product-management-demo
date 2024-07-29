import { Request, Response } from "express";
import Logger from "../lib/winston";
import renderer from "../views/generic-error";
const logger = Logger(`controllers/404-handler`,`debug`);

/**
 * 404 controller
 * Supports application/json and text responses.
 * @param {Request} request Express request object
 * @param {Response} response Express response object
 */
export default function default404 (req:Request,res:Response){
  logger.log(`verbose`, `Entering`);
  const message = `Resource "${req.url}" not found.`;
  logger.log(`debug`, message);
  logger.log(`verbose`, `Exiting`);
  res
    .status(404)
    .send(renderer(message));
}
