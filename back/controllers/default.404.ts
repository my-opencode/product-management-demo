import { Request, Response } from "express";
import Logger from "../lib/winston";
const logger = Logger(`controllers/404-handler`,`debug`);
export default function default404 (req:Request,res:Response){
  logger.log(`debug`, `Resource "${req.url}" not found.`)
  res.status(404).send(`Resource "${req.url}" not found.`);
}