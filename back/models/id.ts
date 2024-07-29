import { validateInt, ValidationError } from "../lib/validators";

/**
 * @class Id
 * @classdesc Represents a MySQL int PK
 * @extends {Number}
 * @implements {Number}
 */
export default class Id extends Number implements Number {
  fieldName: string;
  constructor(id: number, fieldName?: string) {
    super(Id.validator(id, undefined, fieldName));
    this.fieldName = fieldName || `id`
  }
  /**
   * Validates an id value
   * @param {String|Number} candidate candidate value for a database id
   * @param {String} [errMessage] error message override
   * @returns {Number}
   * @throws {ValidationError}
   */
  static validator(candidate: string | number, errMessage = `Invalid 'id' value.`, fieldName?: string): number {
    fieldName = fieldName || `id`;
    try {
      return validateInt(candidate, undefined, 1, fieldName);
    } catch (err) {
      if (err instanceof ValidationError)
        err.message = errMessage;
      throw err;
    }
  }
}