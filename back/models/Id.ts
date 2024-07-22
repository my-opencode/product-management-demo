import { validateInt } from "../lib/validators";

export default class Id {
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
      if (err instanceof Error)
        err.message = errMessage;
      throw err;
    }
  }
}