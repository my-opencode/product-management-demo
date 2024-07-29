import express from "express";
import categoriesGetAll from "../controllers/categories-get-all";

/**
 * router for path /categories
 * Supported subroutes:
 * GET /
 */
const categoriesRouter = express.Router();
categoriesRouter.get(`/`, categoriesGetAll);

export default categoriesRouter;