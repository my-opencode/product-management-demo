import express from "express";
import productsRouter from "./products";
import default404 from "../controllers/default-404";
import errorHandler from "../controllers/error-handler";
import categoriesRouter from "./categories";
import validationErrorHandler from "../controllers/error-validation-handler";

const router = express.Router();
router.use(`/categories`, categoriesRouter);
router.use(`/products`, productsRouter);
router.use(validationErrorHandler);
router.use(errorHandler);
router.use(default404);
export default router;