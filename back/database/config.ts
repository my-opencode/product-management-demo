import fs from "fs";
import { PoolOptions } from "mysql2";
const envFile = process.env.GITHUB_STATE ? `actiondb.env` : process.env.NODE_ENV === `production` ? `.env` : `devdb.env`;
/**
 * Sync function to load database environment variables from file.
 * Mutates process.env 
 */
function loadEnvFromFile() {
  // env is required, therefore sync load
  let envTxt: string | undefined;
  try {
    envTxt = fs.readFileSync(__dirname + `/` + envFile, { encoding: `utf-8` });
  } catch (err) {
    throw new Error(`Unable to read db env file.`);
  }
  if (!envTxt || !envTxt.length)
    throw new Error(`Empty db env file.`);
  envTxt.split(`\n`)
    .forEach(line => {
      const [key, val] = line.split(`=`);
      if (key && val)
        process.env[key] = val;
    });
}
loadEnvFromFile();

/**
 * Parses text env mysql port value as integer. Returns default 1234.
 * @returns {number}
 */
function portFromEnv() {
  const p = parseInt(process.env.MYSQL_TCP_PORT || "");
  if (isNaN(p)) return 1234;
  return p;
}

const databaseConfig: PoolOptions = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  // user: `root`,
  password: process.env.MYSQL_PASSWORD,
  // password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: portFromEnv(),
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

export default databaseConfig;