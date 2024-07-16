import { Express } from "express";
import { Pool } from "mysql2/promise";
export interface RichApp extends Express {
  get(value:"poolConnection"):Pool
}