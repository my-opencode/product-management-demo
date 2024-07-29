import express from "express";
import productsGetAll from "../controllers/products-get-all";
import productsGetOneById from "../controllers/products-get-one-by-id";
import productsParamMwGetProductById from "../middleware/products-param-id";
import paramValidatorMwId from "../middleware/param-id";
import productsCreate from "../controllers/products-create";
import jsonBodyParser from "../lib/json-body-parser";
import productsUpdateOneById from "../controllers/products-update-one-by-id";
import productsDeleteOneById from "../controllers/products-delete-one-by-id";

/**
 * router for path /products
 * Supported subroutes:
 * DELETE /:id
 * GET /:id
 * PATCH /:id
 * GET /
 * POST /
 */
const productsRouter = express.Router();
productsRouter.param(`id`, paramValidatorMwId);
productsRouter.param(`id`, productsParamMwGetProductById);

productsRouter.delete(`/:id`, productsDeleteOneById);
productsRouter.get(`/:id`, productsGetOneById);
productsRouter.patch(`/:id`, jsonBodyParser, productsUpdateOneById);
productsRouter.get(`/`, productsGetAll);
productsRouter.post(`/`, jsonBodyParser, productsCreate);

export default productsRouter;