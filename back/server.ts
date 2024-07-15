
import Logger from "./lib/winston";
import connector, {waitForDbServer} from "./database/connector";

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
  console.log('called directly');
  startServer();
} else {
  console.log('required as a module');
}