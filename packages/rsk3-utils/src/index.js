import numberToBN from 'number-to-bn';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';

// TODO: Let's try to write all functions in this file
// Or, for any function that requires npm library BN, we put them to under bn.js and export here

/**
 * Takes an input and transforms it into an BN
 *
 * @method toBN
 *
 * @param {Number|String|BN} number, string, HEX string or BN
 *
 * @returns {BN} BN
 */
export const toBN = number => {
  try {
    return numberToBN(number);
  } catch (error) {
    throw new Error(`${error} Given value: "${number}"`);
  }
};

/**
 * Converts value to it's number representation
 *
 * @method toDecimal
 *
 * @param {String|Number|BN} value
 *
 * @returns {Number}
 */
const hexToNumber = value => {
  if (!value) {
    return value;
  }

  return toBN(value).toNumber();
};

/**
 * Check if string is HEX, requires a 0x in front
 *
 * @method isHexStrict
 *
 * @param {String} hex to be checked
 *
 * @returns {Boolean}
 */
const isHexStrict = hex => {
  return (isString(hex) || isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex);
};

/**
 * Gets the r,s,v values from a signature
 *
 * @method getSignatureParameters
 *
 * @param {String} ECDSA signature
 *
 * @return {Object} with r,s,v values
 */
const getSignatureParameters = signature => {
  if (!isHexStrict(signature)) {
    throw new Error(`Given value "${signature}" is not a valid hex string.`);
  }

  const r = signature.slice(0, 66);
  const s = `0x${signature.slice(66, 130)}`;
  let v = `0x${signature.slice(130, 132)}`;
  v = hexToNumber(v);

  if (![27, 28].includes(v)) v += 27;

  return {
    r,
    s,
    v
  };
};

export { hexToNumber, hexToNumber as toDecimal, getSignatureParameters };
