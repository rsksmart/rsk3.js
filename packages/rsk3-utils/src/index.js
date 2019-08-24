/* eslint no-useless-catch: 0 */
import numberToBN from 'number-to-bn';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import isBoolean from 'lodash/isBoolean';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import utf8 from 'utf8';
import randombytes from 'randombytes';
import BN from 'bn.js';
import Hash from 'eth-lib/lib/hash';

import {soliditySha3} from './soliditySha3';
import * as rskUnit from './rbtcUnit';
const bs58 = require('bs58');
const wallet = require('ethereumjs-wallet');
const convertHex = require('convert-hex');
const sha256 = require('js-sha256');
const {unitMap} = rskUnit;

// TODO: Let's try to write all functions in this file
// Or, for any function that requires npm library BN, we put them to under bn.js and export here

/**
 * Takes an input and transforms it into an BN
 *
 * @method BN
 *
 * @param {Number|String|BN} number, string, HEX string or BN
 *
 * @returns {BN} BN
 */

/**
 * Returns a random hex string by the given bytes size
 *
 * @param {Number} size
 *
 * @returns {string}
 */

const randomHex = (size) => {
    return '0x' + randombytes(size).toString('hex');
};

/**
 * Should be used to create full function/event name from json abi
 *
 * @method jsonInterfaceMethodToString
 *
 * @param {Object} json
 *
 * @returns {String} full function/event name
 */
const jsonInterfaceMethodToString = (json) => {
    if (isObject(json) && json.name && json.name.includes('(')) {
        return json.name;
    }

    return `${json.name}(${_flattenTypes(false, json.inputs).join(',')})`;
};

/**
 * Should be used to flatten json abi inputs/outputs into an array of type-representing-strings
 *
 * @method _flattenTypes
 *
 * @param {Boolean} includeTuple
 * @param {Object} puts
 *
 * @returns {Array} parameters as strings
 */
const _flattenTypes = (includeTuple, puts) => {
    // console.log("entered _flattenTypes. inputs/outputs: " + puts)
    const types = [];

    puts.forEach((param) => {
        if (typeof param.components === 'object') {
            if (param.type.substring(0, 5) !== 'tuple') {
                throw new Error('components found but type is not tuple; report on GitHub');
            }
            let suffix = '';
            const arrayBracket = param.type.indexOf('[');
            if (arrayBracket >= 0) {
                suffix = param.type.substring(arrayBracket);
            }
            const result = _flattenTypes(includeTuple, param.components);
            // console.log("result should have things: " + result)
            if (isArray(result) && includeTuple) {
                // console.log("include tuple word, and its an array. joining...: " + result.types)
                types.push(`tuple(${result.join(',')})${suffix}`);
            } else if (!includeTuple) {
                // console.log("don't include tuple, but its an array. joining...: " + result)
                types.push(`(${result.join(',')})${suffix}`);
            } else {
                // console.log("its a single type within a tuple: " + result.types)
                types.push(`(${result})`);
            }
        } else {
            // console.log("its a type and not directly in a tuple: " + param.type)
            types.push(param.type);
        }
    });

    return types;
};

/**
 * Returns true if object is BN, otherwise false
 *
 * @method isBN
 *
 * @param {Object} object
 *
 * @returns {Boolean}
 */
const isBN = (object) => {
    return BN.isBN(object);
};

/**
 * Returns true if object is BigNumber, otherwise false
 *
 * @method isBigNumber
 *
 * @param {Object} object
 *
 * @returns {Boolean}
 */
const isBigNumber = (object) => {
    if (isNull(object) || isUndefined(object)) {
        return false;
    }
    return object && object.constructor && object.constructor.name === 'BN';
};

/**
 * Hashes values to a keccak256 hash using keccak 256
 *
 * To hash a HEX string the hex must have 0x in front.
 *
 * @method keccak256
 * @return {String} the keccak256 string
 */
const KECCAK256_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

const keccak256 = (value) => {
    if (isHexStrict(value) && /^0x/i.test(value.toString())) {
        value = hexToBytes(value);
    }

    const returnValue = Hash.keccak256(value); // jshint ignore:line

    if (returnValue === KECCAK256_NULL_S) {
        return null;
    } else {
        return returnValue;
    }
};
// expose the under the hood keccak256
keccak256._Hash = Hash;

/**
 * Takes an input and transforms it into an BN
 *
 * @method toBN
 *
 * @param {Number|String|BN} number, string, HEX string or BN
 *
 * @returns {BN} BN
 */
const toBN = (number) => {
    try {
        return numberToBN(number);
    } catch (error) {
        throw new Error(`${error} Given value: "${number}"`);
    }
};

/**
 * Check if string is HEX
 *
 * @method isHex
 *
 * @param {String} hex to be checked
 *
 * @returns {Boolean}
 */
const isHex = (hex) => {
    return (isString(hex) || isNumber(hex)) && /^(-0x|0x)?[0-9a-f]*$/i.test(hex);
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
const isHexStrict = (hex) => {
    return (isString(hex) || isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex);
};

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 *
 * @param {String} address the given HEX address
 *
 * @param {Number} chainId to define checksum behavior
 *
 * @returns {Boolean}
 */
const isAddress = (address, chainId = null) => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        return false;
        // If it's ALL lowercase or ALL upppercase
    } else if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
        return true;
        // Otherwise check each case
    } else {
        return checkAddressChecksum(address, chainId);
    }
};

/**
 * Convert to a checksummed address.
 *
 * @param {string} address
 *
 * @param {number} chain where checksummed address should be valid.
 *
 * @returns {string} address with checksum applied.
 */
function toChecksumAddress(address, chainId = null) {
    if (typeof address !== 'string') {
        return '';
    }

    if (!/^(0x)?[0-9a-f]{40}$/i.test(address))
        throw new Error(`Given address "${address}" is not a valid Ethereum address.`);

    const stripAddress = stripHexPrefix(address).toLowerCase();
    const prefix = chainId != null ? chainId.toString() + '0x' : '';
    const keccakHash = Hash.keccak256(prefix + stripAddress)
        .toString('hex')
        .replace(/^0x/i, '');
    let checksumAddress = '0x';

    for (let i = 0; i < stripAddress.length; i++)
        checksumAddress += parseInt(keccakHash[i], 16) >= 8 ? stripAddress[i].toUpperCase() : stripAddress[i];

    return checksumAddress;
}

/**
 * Removes prefix from address if exists.
 *
 * @method stripHexPrefix
 *
 * @param {string} string
 *
 * @returns {string} address without prefix
 */
const stripHexPrefix = (string) => {
    return string.startsWith('0x') || string.startsWith('0X') ? string.slice(2) : string;
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method checkAddressChecksum
 *
 * @param {String} address the given HEX address
 *
 * @param {number} chain where checksummed address should be valid.
 *
 * @returns {Boolean}
 */
const checkAddressChecksum = (address, chainId = null) => {
    const stripAddress = stripHexPrefix(address).toLowerCase();
    const prefix = chainId != null ? chainId.toString() + '0x' : '';
    const keccakHash = Hash.keccak256(prefix + stripAddress)
        .toString('hex')
        .replace(/^0x/i, '');

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < stripAddress.length; i++) {
        const output = parseInt(keccakHash[i], 16) >= 8 ? stripAddress[i].toUpperCase() : stripAddress[i];
        if (stripHexPrefix(address)[i] !== output) {
            return false;
        }
    }
    return true;
};

/**
 * Auto converts any given value into it's hex representation.
 * And even stringifys objects before.
 *
 * @method toHex
 *
 * @param {String|Number|BN|Object} value
 * @param {Boolean} returnType
 *
 * @returns {String}
 */
const toHex = (value, returnType) => {
    if (isAddress(value)) {
        return returnType ? 'address' : `0x${value.toLowerCase().replace(/^0x/i, '')}`;
    }

    if (isBoolean(value)) {
        return returnType ? 'bool' : value ? '0x01' : '0x00';
    }

    if (isObject(value) && !isBigNumber(value) && !isBN(value)) {
        return returnType ? 'string' : utf8ToHex(JSON.stringify(value));
    }

    // if its a negative number, pass it through numberToHex
    if (isString(value)) {
        if (value.indexOf('-0x') === 0 || value.indexOf('-0X') === 0) {
            return returnType ? 'int256' : numberToHex(value);
        } else if (value.indexOf('0x') === 0 || value.indexOf('0X') === 0) {
            return returnType ? 'bytes' : value;
        } else if (!isFinite(value)) {
            return returnType ? 'string' : utf8ToHex(value);
        }
    }

    return returnType ? (value < 0 ? 'int256' : 'uint256') : numberToHex(value);
};

/**
 * Converts value to it's decimal representation in string
 *
 * @method hexToNumberString
 *
 * @param {String|Number|BN} value
 *
 * @returns {String}
 */
const hexToNumberString = (value) => {
    if (!value) return value;

    if (isString(value)) {
        if (!isHexStrict(value)) throw new Error(`Given value "${value}" is not a valid hex string.`);
    }

    return toBN(value).toString(10);
};

/**
 * Converts value to it's number representation
 *
 * @method hexToNumber
 *
 * @param {String|Number|BN} value
 *
 * @returns {Number}
 */
const hexToNumber = (value) => {
    if (!value) {
        return value;
    }

    return toBN(value).toNumber();
};

/**
 * Converts value to it's hex representation
 *
 * @method numberToHex
 *
 * @param {String|Number|BN} value
 *
 * @returns {String}
 */
const numberToHex = (value) => {
    if (isNull(value) || typeof value === 'undefined') {
        return value;
    }

    if (!isFinite(value) && !isHexStrict(value)) {
        throw new Error(`Given input "${value}" is not a number.`);
    }

    const number = toBN(value);
    const result = number.toString(16);

    return number.lt(new BN(0)) ? `-0x${result.substr(1)}` : `0x${result}`;
};

/**
 * Should be called to get utf8 from it's hex representation
 *
 * @method hexToUtf8
 *
 * @param {String} hex
 *
 * @returns {String} ascii string representation of hex value
 */
const hexToUtf8 = (hex) => {
    if (!isHexStrict(hex)) throw new Error(`The parameter "${hex}" must be a valid HEX string.`);

    let string = '';
    let code = 0;
    hex = hex.replace(/^0x/i, '');

    // remove 00 padding from either side
    hex = hex.replace(/^(?:00)*/, '');
    hex = hex
        .split('')
        .reverse()
        .join('');
    hex = hex.replace(/^(?:00)*/, '');
    hex = hex
        .split('')
        .reverse()
        .join('');

    const l = hex.length;

    for (let i = 0; i < l; i += 2) {
        code = parseInt(hex.substr(i, 2), 16);
        // if (code !== 0) {
        string += String.fromCharCode(code);
        // }
    }

    return utf8.decode(string);
};

/**
 * Should be called to get ascii from it's hex representation
 *
 * @method hexToAscii
 *
 * @param {String} hex
 *
 * @returns {String} ascii string representation of hex value
 */
const hexToAscii = (hex) => {
    if (!isHexStrict(hex)) throw new Error('The parameter must be a valid HEX string.');

    let value = '';

    let i = 0;
    const l = hex.length;

    if (hex.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i += 2) {
        const code = parseInt(hex.substr(i, 2), 16);
        value += String.fromCharCode(code);
    }

    return value;
};

/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
 *
 * @method utf8ToHex
 *
 * @param {String} value
 *
 * @returns {String} hex representation of input string
 */
const utf8ToHex = (value) => {
    value = utf8.encode(value);
    let hex = '';

    /* eslint-disable no-control-regex */
    // remove \u0000 padding from either side
    value = value.replace(/^(?:\u0000)*/, '');
    value = value
        .split('')
        .reverse()
        .join('');
    value = value.replace(/^(?:\u0000)*/, '');
    value = value
        .split('')
        .reverse()
        .join('');
    /* eslint-enable no-control-regex */

    for (let i = 0; i < value.length; i++) {
        const code = value.charCodeAt(i);
        // if (code !== 0) {
        const n = code.toString(16);
        hex += n.length < 2 ? `0${n}` : n;
        // }
    }

    return `0x${hex}`;
};

/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 *
 * @method asciiToHex
 *
 * @param {String} value
 * @param {Number} length
 *
 * @returns {String} hex representation of input string
 */
const asciiToHex = (value, length = 32) => {
    let hex = '';

    for (let i = 0; i < value.length; i++) {
        const code = value.charCodeAt(i);
        const n = code.toString(16);
        hex += n.length < 2 ? `0${n}` : n;
    }

    return '0x' + padRight(hex, length * 2);
};

/**
 * Convert a hex string to a byte array
 *
 * Note: Implementation from crypto-js
 *
 * @method hexToBytes
 *
 * @param {String} hex
 *
 * @returns {Array} the byte array
 */
const hexToBytes = (hex) => {
    hex = hex.toString(16);

    if (!isHexStrict(hex)) {
        throw new Error(`Given value "${hex}" is not a valid hex string.`);
    }

    hex = hex.replace(/^0x/i, '');
    hex = hex.length % 2 ? '0' + hex : hex;

    const bytes = [];
    for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }

    return bytes;
};

/**
 * Convert a byte array to a hex string
 *
 * Note: Implementation from crypto-js
 *
 * @method bytesToHex
 *
 * @param {Array} bytes
 *
 * @returns {String} the hex string
 */
const bytesToHex = (bytes) => {
    const hex = [];

    for (const element of bytes) {
        hex.push((element >>> 4).toString(16));
        hex.push((element & 0xf).toString(16));
    }

    return `0x${hex.join('').replace(/^0+/, '')}`;
};

/**
 * Takes a number of a unit and converts it to wei.
 *
 * Possible units are:
 *   SI Short
 * - kwei
 * - mwei
 * - gwei
 * - --
 * - --
 * - --
 * - ether
 * - kether
 * - mether
 * - gether
 * - tether
 *
 * @method toWei
 *
 * @param {String|BN} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert from, default ether
 *
 * @returns {String|BN} When given a BN object it returns one as well, otherwise a string
 */
const toWei = (number, unit) => {
    unit = getUnitValue(unit);

    if (!isBN(number) && !isString(number)) {
        throw new Error('Please pass numbers as strings or BN objects to avoid precision errors.');
    }

    return isBN(number) ? rskUnit.toWei(number, unit) : rskUnit.toWei(number, unit).toString(10);
};

/**
 * Returns value of unit in Wei
 *
 * @method getUnitValue
 *
 * @param {String} unit the unit to convert to, default ether
 *
 * @returns {BN} value of the unit (in Wei)
 * @throws error if the unit is not correct
 */
const getUnitValue = (unit) => {
    unit = unit ? unit.toLowerCase() : 'ether';
    if (!rskUnit.unitMap[unit]) {
        throw new Error(
            `This unit "${unit}" doesn't exist, please use the one of the following units${JSON.stringify(
                rskUnit.unitMap,
                null,
                2
            )}`
        );
    }

    return unit;
};

/**
 * Takes a number of wei and converts it to any other ether unit.
 *
 * Possible units are:
 *   SI Short
 * - kwei
 * - mwei
 * - gwei
 * - --
 * - --
 * - ether
 * - kether
 * - mether
 * - gether
 * - tether
 *
 * @method fromWei
 *
 * @param {String|BN} number can be a BigNumber, number string or a HEX of a decimal
 * @param {String} unit the unit to convert to, default ether
 *
 * @returns {String} Returns a string
 */
const fromWei = (number, unit) => {
    unit = getUnitValue(unit);

    if (!isBN(number) && !isString(number)) {
        throw new Error('Please pass numbers as strings or BN objects to avoid precision errors.');
    }

    return isBN(number) ? rskUnit.fromWei(number, unit) : rskUnit.fromWei(number, unit).toString(10);
};

/**
 * Should be called to pad string to expected length
 *
 * @method padRight
 *
 * @param {String} string to be padded
 * @param {Number} chars that result string should have
 * @param {String} sign, by default 0
 *
 * @returns {String} right aligned string
 */
const padRight = (string, chars, sign) => {
    const hasPrefix = /^0x/i.test(string) || typeof string === 'number';
    string = string.toString(16).replace(/^0x/i, '');

    const padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;

    return (hasPrefix ? '0x' : '') + string + new Array(padding).join(sign || '0');
};

/**
 * Should be called to pad string to expected length
 *
 * @method padLeft
 *
 * @param {String} string to be padded
 * @param {Number} chars that result string should have
 * @param {String} sign, by default 0
 *
 * @returns {String} left aligned string
 */
const padLeft = (string, chars, sign) => {
    const hasPrefix = /^0x/i.test(string) || typeof string === 'number';
    string = string.toString(16).replace(/^0x/i, '');

    const padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;

    return (hasPrefix ? '0x' : '') + new Array(padding).join(sign || '0') + string;
};

/**
 * Takes and input transforms it into BN and if it is negative value, into two's complement
 *
 * @method toTwosComplement
 *
 * @param {Number|String|BN} number
 *
 * @returns {String}
 */
const toTwosComplement = (number) => {
    return `0x${toBN(number)
        .toTwos(256)
        .toString(16, 64)}`;
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
const getSignatureParameters = (signature) => {
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

/**
 * Decode BTC private key to into bypes
 * @param {string} bitcoinPrivateKey
 */
const keyBtcToRskInBytes = (btcPrivateKey) => {
    var decodedKey = bs58.decode(btcPrivateKey);
    var privKeyBytes = decodedKey.slice(1, decodedKey.length - 5);
    return privKeyBytes;
};

/**
 * Convert a BTC private key into RSK private key format
 * @param {string} btcPrivateKey
 */
const privateKeyToRskFormat = (btcPrivateKey) => {
    const privKeyBytes = keyBtcToRskInBytes(btcPrivateKey);
    const privKeyInRskFormat = Buffer.from(privKeyBytes).toString('hex');
    return privKeyInRskFormat;
};

/**
 * Generate a RSK public address with a BTC private key
 * @param {string} btcPrivateKey
 */
const getRskAddress = (btcPrivateKey) => {
    const myWallet = wallet.fromPrivateKey(Buffer.from(keyBtcToRskInBytes(btcPrivateKey)));
    const addressInRskFormat = myWallet.getAddress();
    return addressInRskFormat.toString('hex');
};

/**
 * Generate BTC private key based on Bitcoin network (mainnet, testnet) and RSK wallet public address
 * @param {string} btcNet MAIN_NET or TEST_NET
 * @param {string} rskAddress RSK wallet public address
 */
const getBtcPrivateKey = (btcNet, rskAddress) => {
    const addressArray = convertHex.hexToBytes(rskAddress);
    const partialResult = [];
    const result = [];

    if (btcNet === 'MAIN_NET') {
        partialResult.push(0x80);
    } else {
        partialResult.push(0xef);
    }

    for (const element of addressArray) {
        partialResult.push(element);
    }

    partialResult.push(0x01);
    var check = convertHex.hexToBytes(sha256(convertHex.hexToBytes(sha256(partialResult))));

    for (const element of partialResult) {
        result.push(element);
    }

    for (var i = 0; i < 4; i++) {
        result.push(check[i]);
    }

    return bs58.encode(result);
};

export {
    randomHex,
    jsonInterfaceMethodToString,
    BN,
    toBN,
    isBN,
    isBigNumber,
    keccak256,
    keccak256 as sha3,
    soliditySha3,
    isHex,
    isHexStrict,
    isAddress,
    toChecksumAddress,
    stripHexPrefix,
    checkAddressChecksum,
    toHex,
    hexToNumberString,
    hexToNumber,
    hexToNumber as toDecimal,
    numberToHex,
    numberToHex as fromDecimal,
    hexToUtf8,
    hexToUtf8 as hexToString,
    hexToUtf8 as toUtf8,
    hexToAscii,
    hexToAscii as toAscii,
    utf8ToHex,
    utf8ToHex as stringToHex,
    utf8ToHex as fromUtf8,
    asciiToHex,
    asciiToHex as fromAscii,
    hexToBytes,
    bytesToHex,
    toWei,
    fromWei,
    unitMap,
    padRight,
    padRight as rightPad,
    padLeft,
    padLeft as leftPad,
    toTwosComplement,
    getSignatureParameters,
    privateKeyToRskFormat,
    getRskAddress,
    getBtcPrivateKey
};
