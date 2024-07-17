import express from "express";
import categoriesGetAll from "../controllers/categories-get-all";

const categoriesRouter = express.Router();
categoriesRouter.get(`/`, categoriesGetAll);

export default categoriesRouter;