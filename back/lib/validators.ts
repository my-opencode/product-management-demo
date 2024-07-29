/**
 * @class ValidationErrorStack
 * @classdesc is a class extending Array<ValidationError>. Represents schema validation results.
 * @extends {Array<ValidationError>}
 * @property {String} message
 * @property {Number} statusCode
 */
export class ValidationErrorStack extends Array<ValidationError> {
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

/**
 * @class 
 * @name ValidationError
 * @classdesc is a class extending Error. Represent the validation of a schema's field.
 * @property {String} fieldName
 * @property {String} message
 * @property {Number} statusCode
 */
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
/**
 * Validates a string. Defaults to validating a MySQL VARCHAR field.
 * @param {*} val Value to test
 * @param {Number} [maxLength] Max length. Default is MySQL VARCHAR max length.
 * @param {Number} [minLength] Min length. Default is 0.
 * @param {String} [fieldName] Name of the field being tested.
 * @returns {String}
 */
export function validateString(val: unknown, maxLength = 65535, minLength = 0, fieldName?: string) {
  fieldName = fieldName || `string`;
  let _val = String(val);
  if (maxLength && _val.length > maxLength)
    throw new ValidationError(`Too long. Max length: ${maxLength}.`, fieldName);
  if (minLength && _val.length < minLength)
    throw new ValidationError(`Too short. Min length: ${minLength}.`, fieldName);
  return _val;
}
/**
 * Validates a decimal number. Defaults to validating a MySQL DECIMAL(7,2) field.
 * @param {*} val Value to test
 * @param {Number} [maxValue] Upper value limit. Default is that of a MySQL DECIMAL(7,2).
 * @param {Number} [minValue] Lower value limit. Default is that of a MySQL DECIMAL(7,2).
 * @param {String} [fieldName] Name of the field being tested.
 * @returns {Number}
 */
export function validateFloat(val: unknown, maxValue = 99999.99, minValue = -99999.99, fieldName?: string) {
  fieldName = fieldName || `float`;
  let _val = parseFloat(String(val));
  if (isNaN(_val) || !isFinite(_val))
    throw new ValidationError(`Not an finite float.`, fieldName);
  if (maxValue && _val > maxValue)
    throw new ValidationError(`Too high. Max value: ${maxValue}.`, fieldName);
  if (minValue !== undefined && _val < minValue)
    throw new ValidationError(`Too low. Min value: ${minValue}.`, fieldName);
  return _val;
}
/**
 * Validates an integer number. Defaults to validating a MySQL INT field.
 * @param {*} val Value to test
 * @param {Number} [maxValue] Upper value limit. Default is that of a MySQL INT.
 * @param {Number} [minValue] Lower value limit. Default is that of a MySQL INT.
 * @param {String} [fieldName] Name of the field being tested.
 * @returns {Number}
 */
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

/**
 * Validates an integer number. Defaults to validating a MySQL MEDIUMINT field.
 * @param {*} val Value to test
 * @param {Number} [maxValue] Upper value limit. Default is that of a MySQL MEDIUMINT.
 * @param {Number} [minValue] Lower value limit. Default is that of a MySQL MEDIUMINT.
 * @param {String} [fieldName] Name of the field being tested.
 * @returns {Number}
 */
export function validateMediumInt(val: unknown, maxValue = 16777215, minValue = -8388608, fieldName?: string) {
  return validateInt(val, maxValue, minValue, fieldName);
}
/**
 * Validates an integer number. Defaults to validating a MySQL SMALLINT field.
 * @param {*} val Value to test
 * @param {Number} [maxValue] Upper value limit. Default is that of a MySQL SMALLINT.
 * @param {Number} [minValue] Lower value limit. Default is that of a MySQL SMALLINT.
 * @param {String} [fieldName] Name of the field being tested.
 * @returns {Number}
 */
export function validateSmallInt(val: unknown, maxValue = 65535, minValue = -32768, fieldName?: string) {
  return validateInt(val, maxValue, minValue, fieldName);
}
/**
 * Validates an integer number. Defaults to validating a MySQL TINYINT field.
 * @param {*} val Value to test
 * @param {Number} [maxValue] Upper value limit. Default is that of a MySQL TINYINT.
 * @param {Number} [minValue] Lower value limit. Default is that of a MySQL TINYINT.
 * @param {String} [fieldName] Name of the field being tested.
 * @returns {Number}
 */
export function validateTinyInt(val: unknown, maxValue = 255, minValue = -128, fieldName?: string) {
  return validateInt(val, maxValue, minValue, fieldName);
}
