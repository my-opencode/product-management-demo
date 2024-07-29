import winston from "winston";
const DEFAULT_LOG_LEVEL = process?.env?.LOG_LEVEL || `info`;

/**
 * Initialises a winston logger for a service
 * @param {string} service Name of the service logging
 * @param {string} [level] Minimum logging level. Defaults to info
 * @returns {winston.Logger}
 */
export default function Logger(service:string, level=DEFAULT_LOG_LEVEL){
  const logger = winston.createLogger({
    level,
    format: winston.format.json(),
    defaultMeta: { service },
    transports: [
      new winston.transports.File({ filename: `logs/error.log`, level: `error` }),
      new winston.transports.File({ filename: `logs/debug.log`, level: `debug` }),
      new winston.transports.File({ filename: `logs/${service}.log` }),
      new winston.transports.Console({})
    ],
  });
  return logger;
}