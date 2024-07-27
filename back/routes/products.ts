import express from "express";
import productsGetAll from "../controllers/products-get-all";
import productsGetOneById from "../controllers/products-get-one-by-id";
import productsParamMwGetProductById from "../middleware/products-param-id";
import paramValidatorMwId from "../middleware/param-id";
import productsCreate from "../controllers/products-post-create";
import jsonBodyParser from "../lib/jsonBodyParser";
import productsUpdateOneById from "../controllers/products-patch-update-one-by-id";
import productsDeleteOneById from "../controllers/products-delete-delete-one-by-id";

const productsRouter = express.Router();
productsRouter.param(`id`, paramValidatorMwId);
productsRouter.param(`id`, productsParamMwGetProductById);

productsRouter.delete(`/:id`, productsDeleteOneById);
productsRouter.get(`/:id`, productsGetOneById);
productsRouter.patch(`/:id`, jsonBodyParser, productsUpdateOneById);
productsRouter.get(`/`, productsGetAll);
productsRouter.post(`/`, jsonBodyParser, productsCreate);

export default productsRouter;