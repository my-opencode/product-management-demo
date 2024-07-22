export class ValidationErrorStack extends Array {
  message = ``;
  statusCode = 422;
  /**
   * ValidationErrorStack constructor. Takes an array of validation errors and an optional description
   * @param {ValidationError[]} errors stack of validation errors
   * @param {string} [message] description of the stack of validation errors. Example: 'invalid product'
   */
  constructor(errors: ValidationError[], message?: string, statusCodeOverride?:number) {
    if(!Array.isArray(errors) || !errors.every(e => e instanceof ValidationError)) throw new TypeError(`Expecting array of ValidationErrors`);
    super();
    this.push(...errors);
    if (message) this.message = message;
    if(statusCodeOverride && statusCodeOverride > 99 && statusCodeOverride < 600)
      this.statusCode = statusCodeOverride;
  }
  toString(){
    let str = `ValidationErrorStack: ` + this.message + `; Stack: `;
    // fixes bug with VES.map(e=>String(e)).join() that calls constructor with the string value of errors.
    const errs = [...this];
    if(this.length) str += errs.map(e=>String(e)).join(`, `);
    else str += `empty`;
    return str;
  }
}
export class ValidationError extends Error {
  fieldName: string = "unknown field";
  statusCode = 422;
  constructor(msg: string, fieldName?: string, statusCodeOverride?:number) {
    super(msg);
    if (fieldName)
      this.fieldName = fieldName;
    if(statusCodeOverride && statusCodeOverride > 99 && statusCodeOverride < 600)
      this.statusCode = statusCodeOverride;
  }
  toString(){
    return `ValidationError: ` + this.fieldName + `: ` + this.message;
  }
};
export function validateInt(val: unknown, maxValue = 4294967295, minValue = -2147483648, fieldName?: string) {
  fieldName = fieldName || `int`;
  let _val = parseInt(String(val));
  if (isNaN(_val) || !isFinite(_val))
    throw new ValidationError(`Not an finite integer.`, fieldName);
  if (maxValue && _val > maxValue)
    throw new ValidationError(`Too high. Max value: ${maxValue}.`, fieldName);
  if (minValue !== undefined && _val < minValue)
    throw new ValidationError(`Too low. Min value: ${minValue}.`, fieldName);
  return _val;
}
