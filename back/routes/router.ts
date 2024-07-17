import { Express } from "express";
import productsRouter from "./products";
import default404 from "../controllers/default.404";
import errorHandler from "../controllers/errorHandler";
import categoriesGetAll from "../controllers/categories-get-all";

export default function setRoutes(app: Express) {
  app.use(`/categories`, categoriesGetAll);
  app.use(`/products`, productsRouter);
  app.use(errorHandler);
  app.use(default404);
}