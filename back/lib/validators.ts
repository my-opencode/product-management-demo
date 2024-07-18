export class ValidationError extends Error { };
export function validateString(val: unknown, maxLength = 65535, minLength = 0) {
  let _val = String(val);
  if (maxLength && _val.length > maxLength)
    throw new ValidationError(`Too long. Max length: ${maxLength}.`);
  if (minLength && _val.length < minLength)
    throw new ValidationError(`Too short. Min length: ${minLength}.`);
  return _val;
}
export function validateFloat(val: unknown, maxValue = 99999.99, minValue = -99999.99) {
  let _val = parseFloat(String(val));
  if (isNaN(_val) || !isFinite(_val))
    throw new ValidationError(`Not an finite float.`);
  if (maxValue && _val > maxValue)
    throw new ValidationError(`Too high. Max value: ${maxValue}.`);
  if (minValue !== undefined && _val < minValue)
    throw new ValidationError(`Too low. Min value: ${minValue}.`);
  return _val;
}
export function validateInt(val: unknown, maxValue = 4294967295, minValue = -2147483648) {
  let _val = parseInt(String(val));
  if (isNaN(_val) || !isFinite(_val))
    throw new ValidationError(`Not an finite integer.`);
  if (maxValue && _val > maxValue)
    throw new ValidationError(`Too high. Max value: ${maxValue}.`);
  if (minValue !== undefined && _val < minValue)
    throw new ValidationError(`Too low. Min value: ${minValue}.`);
  return _val;
}
export function validateMediumInt(val: unknown, maxValue = 16777215, minValue = -8388608) {
  return validateInt(val, maxValue, minValue);
}
export function validateSmallInt(val: unknown, maxValue = 65535, minValue = -32768) {
  return validateInt(val, maxValue, minValue);
}
export function validateTinyInt(val: unknown, maxValue = 255, minValue = -128) {
  return validateInt(val, maxValue, minValue);
}
