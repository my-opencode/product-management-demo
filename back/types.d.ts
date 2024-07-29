import { Application, Express, Request } from "express";
import { Pool } from "mysql2/promise";
import AppSymbols from "./AppSymbols";
import Product from "./models/product";
import * as core from "express-serve-static-core";
import Id from "./models/id";

export interface RichApp extends Express.Application, Record<string, any> {
  get(value: keyof AppSymbols): Pool
}
export interface RequestWithId extends Request<core.ParamsDictionary, any, any, core.Query, Record<string, any>> {
  app: RichApp;
  id?: Id;
}
export interface RequestWithProduct extends RequestWithId, Request<core.ParamsDictionary, any, any, core.Query, Record<string, any>> {
  app: RichApp;
  id?: Id;
  product?: Product
}