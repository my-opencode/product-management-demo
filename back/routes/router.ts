import { Express } from "express";
import productsRouter from "./products";
import default404 from "../controllers/default.404";
import errorHandler from "../controllers/errorHandler";

export default function setRoutes(app: Express) {
  app.use(`/products`, productsRouter);
  app.use(errorHandler);
  app.use(default404);
}