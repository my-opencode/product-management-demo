import { ValidationErrorStack, ValidationError } from "../lib/validators";
export interface ValidationErrorResponseJson {
  description?: string;
  errors: { [fieldName: string]: string|number };
}
export default function renderer(errorData: ValidationErrorStack | ValidationError): string {
  if (errorData instanceof ValidationErrorStack)
    return renderErrorStack(errorData);
  else
    return renderOneError(errorData);
}
export function renderOneError(err: ValidationError): string {
  return JSON.stringify({ errors: { [err.fieldName]: err.message }, description: err.message });
}
export function renderErrorStack(errors: ValidationErrorStack): string {
  const payload: { errors: any, description?: string } = {
    errors: errors.reduce((obj, err) => { obj[err.fieldName] = err.message; return obj; }, {})
  };
  if (errors.message)
    payload.description = errors.message;
  return JSON.stringify(payload);
}