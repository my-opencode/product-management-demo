import { Express } from "express";
import setProductsRoutes from "./products";
import default404 from "../controllers/default.404";

export default function setRoutes(app:Express) {
  setProductsRoutes(app);
  app.use(default404);
}