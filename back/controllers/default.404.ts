import { Request, Response } from "express";
import Logger from "../lib/winston";
const logger = Logger(`controllers/404-handler`,`debug`);
export default function default404 (req:Request,res:Response){
  const message = `Resource "${req.url}" not found.`;
  logger.log(`debug`, message);
  // todo move to view
  if(req.headers?.accept === `application/json`)
    res.status(404)
    .set(`Accept`,`application/json`)
    .send(`{"description":"${message}",errors:[{"${req.url}":"${message}"}]}`);
  else
    res.status(404).send(message);
}