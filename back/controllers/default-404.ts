import { Request, Response } from "express";
import Logger from "../lib/winston";
import renderer from "../views/generic-error";
const logger = Logger(`controllers/404-handler`,`debug`);
export default function default404 (req:Request,res:Response){
  const message = `Resource "${req.url}" not found.`;
  logger.log(`debug`, message);
  res
    .status(404)
    .send(renderer(message));
}
