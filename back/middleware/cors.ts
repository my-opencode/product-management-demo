import { Application } from "express";
import cors, { CorsOptions } from "cors";

export default function setCors(app: Application) {
  const options: CorsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PATCH,POST,DELETE",
    "preflightContinue": true,
    "optionsSuccessStatus": 204
  }
  app.options(`*`, cors(options));
  app.use(cors(options));
}