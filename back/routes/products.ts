import express from "express";
import productsGetAll from "../controllers/products-get-all";

const productsRouter = express.Router();
productsRouter.get(`/`, productsGetAll);

export default productsRouter;