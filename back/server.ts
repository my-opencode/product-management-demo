
import Logger from "./lib/winston";

/**
 * Entry point for the server.
 */
export default async function startServer(){
  const logger = Logger(`server`);

  console.log("Hello World");
  logger.info("Console just printed 'hello world'.");
  logger.error("This is an error log.");
}

if (require.main === module) {
  console.log('called directly');
  startServer();
} else {
  console.log('required as a module');
}