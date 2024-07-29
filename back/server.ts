
import Logger from "./lib/winston";
import connector, { waitForDbServer } from "./database/connector";
import express from "express";
import router from "./routes/router";
import { Server } from "http";
import AppSymbols from "./AppSymbols";
import setCors from "./middleware/cors";
const logger = Logger(`server`);
const PORT = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000;
export interface StartServerOptions {
  skipDatabase?: boolean;
  skipRoutes?: boolean;
  skipListen?: boolean;
}
/**
 * Entry point for the server.
 * Accepts start options for easier testing:
 * @param {StartServerOptions} [options] start options
 * @param {Boolean} [options.skipDatabase] starts server without connecting to a database
 * @param {Boolean} [options.skipListen] creates server app without listening to a port
 * @param {Boolean} [options.skipRoutes] starts server without mounting routes
 * @returns {Express}
 */
export default async function startServer(options?: StartServerOptions) {
  const app = express();
  setCors(app);

  let disconnectDatabase = function () { };
  logger.log(`info`, `Initializing start server sequence.`);

  if (!options?.skipDatabase) {
    logger.log(`debug`, `Connecting DB.`);
    await waitForDbServer();
    const connectionPool = connector();
    logger.log(`debug`, `Connected DB.`);
    disconnectDatabase = function () {
      logger.log(`debug`, `Disconnecting DB.`);
      connectionPool.end();
      logger.log(`debug`, `Disconnected DB.`);
    }
    app.set(AppSymbols.connectionPool, connectionPool);
  } else logger.log(`warn`, `Skipping Database`);

  // route logging
  app.use((req, res, next) => {
    logger.log(`debug`, `Received ${req.method} request to ${req.url}`);
    next();
  });

  // restrict to application/json
  app.use(function (req, res, next) {
    if (req.headers?.accept && req.headers.accept !== `application/json`)
      return res.status(415).send(`This API only supports application/json media type.`);
    res.set(`Content-Type`, `application/json`);
    next();
  });

  if (!options?.skipRoutes) {
    app.use(router);
  } else logger.log(`warn`, `Skipping Routes`);

  let server: Server;
  if (!options?.skipListen)
    server = app.listen(PORT, () => { logger.log(`info`, `Server listening on ${PORT}.`); });
  else logger.log(`warn`, `Skipping Listening`);

  const shutdown = async function () {
    if (!options?.skipListen) {
      await new Promise(r => server.close(r));
      logger.log(`info`, `Server closed.`);
    }
    disconnectDatabase();
  }
  // graceful shutdown
  app.on(`close`, shutdown);
  process.on(`SIGTERM`, () => {
    logger.log(`warn`, `Received SIGTERM signal: closing server.`);
    shutdown();
  });
  process.on(`SIGINT`, () => {
    logger.log(`warn`, `Received SIGINT signal: closing server.`);
    shutdown();
  });

  await new Promise(r => process.nextTick(r));
  return app;
}

/**
 * Will start automatically if this script is called by node.
 * Will not start if this script is imported/required by another.
 */
if (require.main === module) {
  logger.log(`debug`, `Called directly`);
  startServer();
} else {
  logger.log(`debug`, `required as a module`);
}