import express, { Express } from "express";
import productsRouter from "./products";
import default404 from "../controllers/default.404";
import errorHandler from "../controllers/errorHandler";
import categoriesRouter from "./categories";

const router = express.Router();
router.use(`/categories`, categoriesRouter);
router.use(`/products`, productsRouter);
router.use(errorHandler);
router.use(default404);
export default router;