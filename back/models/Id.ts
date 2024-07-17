export default class Id {
  /**
   * Validates an id value
   * @param {String|Number} candidate candidate value for a database id
   * @param {String} [errMessage] error message override
   * @returns {Number}
   */
  static validator(candidate: string | number, errMessage = `Invalid 'id' value.`): number {
    candidate = parseInt(String(candidate));
    if (!isNaN(candidate) && isFinite(candidate) && candidate > 0)
      return candidate;
    throw new TypeError(errMessage);
  }
}