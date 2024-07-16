
import Logger from "./lib/winston";
const logger = Logger(`server`);
/**
 * Entry point for the server.
 */
export default async function startServer(){
  const logger = Logger(`server`);

  logger.log(`info`,`Initializing start server sequence.`);
  logger.log(`debug`,`Connecting DB.`);
  await waitForDbServer();
  const connectionPool = connector();
  logger.log(`debug`, `Connected DB.`);
  
  logger.log(`debug`, `Disconnecting DB.`);
  connectionPool.end();
  logger.log(`debug`, `Disonnected DB.`);
}

if (require.main === module) {
  logger.log(`debug`, `Called directly`);
  startServer();
} else {
  logger.log(`debug`,`required as a module`);
}