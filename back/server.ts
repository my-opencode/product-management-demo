
import Logger from "./lib/winston";
import connector, { waitForDbServer } from "./database/connector";
import express from "express";
import setRoutes from "./routes/router";
import { Server } from "http";
import AppSymbols from "./AppSymbols";
const logger = Logger(`server`);
const PORT = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000;
export interface StartServerOptions {
  skipDatabase?: boolean;
  skipRoutes?: boolean;
  skipListen?: boolean;
}
/**
 * Entry point for the server.
 */
export default async function startServer(options?: StartServerOptions) {
  const app = express();

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
      logger.log(`debug`, `Disonnected DB.`);
    }
    app.set(AppSymbols.connectionPool, connectionPool);
  } else logger.log(`warn`, `Skipping Database`);

  if (!options?.skipRoutes)
    setRoutes(app);
  else logger.log(`warn`, `Skipping Routes`);

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
  app.on(`close`, shutdown);
  process.on('SIGTERM', () => {
    logger.log(`warning`, `Received SIGTERM signal: closing server.`);
    shutdown();
  });
  process.on('SIGINT', () => {
    logger.log(`warning`, `Received SIGINT signal: closing server.`);
    shutdown();
  });

  await new Promise(r => process.nextTick(r));
  return app;
}

if (require.main === module) {
  logger.log(`debug`, `Called directly`);
  startServer();
} else {
  logger.log(`debug`,`required as a module`);
}