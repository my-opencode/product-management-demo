import mysql,{ Pool } from "mysql2/promise";
import databaseConfig from "./config";
import Logger from "../lib/winston";

const logger = Logger(`connector`, `debug`);

/**
 * Initializes a mysql connection pool
 * @returns {Pool}
 */
export default function connector():Pool {
  const pool = mysql.createPool(databaseConfig);
  return pool;
}

/**
 * Resolves when the DB server accepts connections
 * or rejects after a 60 secs timeout
 * Intended for early tests since github automated tests & deployment 
 * should wait for health checks on the database container prior to 
 * starting the app/server container.
 * @param {Number} [timeoutInSeconds]
 */
export async function waitForDbServer(timeoutInSeconds = 60) {
  let continueFlag = true;
  let iterationCount = 0;
  let _c: mysql.Connection | undefined;
  while (continueFlag) {
    iterationCount++;
    logger.log(`debug`, `Connection attempt #${iterationCount}`);
    try {
      _c = await mysql.createConnection(databaseConfig);
      continueFlag = false;
    } catch (err) {
      if (err instanceof Error){
        if(err.message.includes(`Access denied for user`))
            throw new Error(`User is not allowed on DB. Please check the Database env file.`);
        logger.log(`debug`, `Got error ${err.message}`);
      }
    }
    continueFlag = continueFlag && iterationCount < timeoutInSeconds;
    // cooldown
    await new Promise(r => setTimeout(r, 1000));
  }
  if (!_c)
    throw new Error(`Initial connection to DB server timed out.`);

  logger.log(`info`, `Connected after ${iterationCount} attempts.`);
  const result = await _c.query(`SELECT 1 AS nbr;`)
  // logger.log(`debug`, result);
  _c.end();
}