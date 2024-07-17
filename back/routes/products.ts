import express from "express";
import productsGetAll from "../controllers/products-get-all";
import productsGetOneById from "../controllers/products-get-one-by-id";
import productsParamMwGetProductById from "../middleware/products-param-id";
import paramValidatorMwId from "../middleware/param-id";

const productsRouter = express.Router();
productsRouter.param(`id`, paramValidatorMwId);
productsRouter.param(`id`, productsParamMwGetProductById);

productsRouter.get(`/:id`, productsGetOneById);
productsRouter.get(`/`, productsGetAll);

export default productsRouter;