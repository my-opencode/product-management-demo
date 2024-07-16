import { Request, Response } from "express";
export default function default404 (req:Request,res:Response){
  res.status(404).send(`Resource "${req.url}" not found.`);
}