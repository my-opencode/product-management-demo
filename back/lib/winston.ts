import winston from "winston";

export default function Logger(service:string, level="info"){
  const logger = winston.createLogger({
    level,
    format: winston.format.json(),
    defaultMeta: { service },
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: `logs/${service}.log` }),
      new winston.transports.Console({})
    ],
  });
  return logger;
}