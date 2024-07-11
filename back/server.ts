
import Logger from "./lib/winston";

export default async function server(){
  const logger = Logger(`server`);

  console.log("Hello World");
  logger.info("Console just printed 'hello world'.");
  logger.error("This is an error log.");
}

if (require.main === module) {
  console.log('called directly');
  server();
} else {
  console.log('required as a module');
}