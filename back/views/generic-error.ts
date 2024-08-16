import { ErrorJsonResponse } from "./json-response-format";

/**
 * Returns a JSON view of an error
 * @param {Error | *} err single error
 * @returns {String}
 */
export default function renderer(err: Error | any): string {
  const payload: ErrorJsonResponse = {
    description: err instanceof Error ? err.message : String(err),
  };
  return JSON.stringify(payload);
}