import { Express } from "express";
import { Pool } from "mysql2/promise";
import AppSymbols from "./AppSymbols";
export interface RichApp extends Express {
  get(value:keyof AppSymbols):Pool
}