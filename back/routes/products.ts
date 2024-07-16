import { Express } from "express";
import productsGetAll from "../controllers/products-get-all";

export default function setProductsRoutes(app:Express){
  app.get(`/products/`, productsGetAll)
}