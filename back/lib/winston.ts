import winston from "winston";

/**
 * Initialises a winston logger for a service
 * @param {string} service Name of the service logging
 * @param {string} [level] Minimum logging level. Defaults to info
 * @returns {winston.Logger}
 */
export default function Logger(service:string, level="info"){
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