import { ValidationErrorStack, ValidationError } from "../lib/validators";
import { ValidationErrorStackJsonResponse } from "./json-response-format";

/**
 * Returns a JSON view of a validation error
 * @param {ValidationErrorStack | ValidationError} errorData single validation error or stack
 * @returns {String}
 */
export default function renderer(errorData: ValidationErrorStack | ValidationError): string {
  return JSON.stringify(
    errorData instanceof ValidationErrorStack
      ? convertErrorStackToPayload(errorData)
      : convertOneErrorToPayload(errorData)
  );
}
/**
 * Converts a ValidationError into a ValidationErrorStackJsonResponse
 * @param {ValidationError} err validation error
 * @returns {ValidationErrorStackJsonResponse}
 */
export function convertOneErrorToPayload(err: ValidationError): ValidationErrorStackJsonResponse {
  return { errors: { [err.fieldName]: err.message }, description: err.message };
}
/**
 * Converts a ValidationErrorStack into a ValidationErrorStackJsonResponse
 * @param {ValidationErrorStack} errors validation error stack
 * @returns {ValidationErrorStackJsonResponse}
 */
export function convertErrorStackToPayload(errors: ValidationErrorStack) {
  const payload: ValidationErrorStackJsonResponse = { errors: {} };
  if (errors.message)
    payload.description = errors.message;
  for (const err of errors)
    payload.errors[err.fieldName] = err.message;
  return payload;
}