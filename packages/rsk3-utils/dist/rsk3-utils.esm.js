import numberToBN from 'number-to-bn';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import isNull from 'lodash/isNull';
import isBoolean from 'lodash/isBoolean';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import utf8 from 'utf8';
import randombytes from 'randombytes';
import BN from 'bn.js';
export { default as BN } from 'bn.js';
import Hash from 'eth-lib/lib/hash';
import map from 'lodash/map';
import has from 'lodash/has';
import bs58 from 'bs58';
import wallet from 'ethereumjs-wallet';
import convertHex from 'convert-hex';
import sha256 from 'js-sha256';

var zero = new BN(0);
var negative1 = new BN(-1);
var unitMap = {
  wei: '1',
  kwei: '1000',
  Kwei: '1000',
  mwei: '1000000',
  Mwei: '1000000',
  gwei: '1000000000',
  Gwei: '1000000000',
  ether: '1000000000000000000',
  kether: '1000000000000000000000',
  mether: '1000000000000000000000000',
  gether: '1000000000000000000000000000',
  tether: '1000000000000000000000000000000'
};
function getValueOfUnit(unitInput) {
  var unit = unitInput ? unitInput.toLowerCase() : 'ether';
  var unitValue = unitMap[unit];
  if (typeof unitValue !== 'string') {
    throw new TypeError('[rbtc-unit] the unit provided ' + unitInput + " doesn't exists, please use the one of the following units " + JSON.stringify(unitMap, null, 2));
  }
  return new BN(unitValue, 10);
}
function numberToString(argument) {
  if (typeof argument === 'string') {
    if (!argument.match(/^-?[0-9.]+$/)) {
      throw new Error("while converting number to string, invalid number value '" + argument + "', should be a number matching (^-?[0-9.]+).");
    }
    return argument;
  } else if (typeof argument === 'number') {
    return String(argument);
  } else if (typeof argument === 'object' && argument.toString && (argument.toTwos || argument.dividedToIntegerBy)) {
    if (argument.toPrecision) {
      return String(argument.toPrecision());
    } else {
      return argument.toString(10);
    }
  }
  throw new Error("while converting number to string, invalid number value '" + argument + "' type " + typeof argument + '.');
}
function fromWei(weiInput, unit, optionsInput) {
  var wei = numberToBN(weiInput);
  var negative = wei.lt(zero);
  var base = getValueOfUnit(unit);
  var baseLength = unitMap[unit].length - 1 || 1;
  var options = optionsInput || {};
  if (negative) {
    wei = wei.mul(negative1);
  }
  var fraction = wei.mod(base).toString(10);
  while (fraction.length < baseLength) {
    fraction = '0' + fraction;
  }
  if (!options.pad) {
    fraction = fraction.match(/^(\d*[1-9]|0)(0*)/)[1];
  }
  var whole = wei.div(base).toString(10);
  if (options.commify) {
    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  var value = '' + whole + (fraction === '0' ? '' : '.' + fraction);
  if (negative) {
    value = '-' + value;
  }
  return value;
}
function toWei(etherInput, unit) {
  var ether = numberToString(etherInput);
  var base = getValueOfUnit(unit);
  var baseLength = unitMap[unit].length - 1 || 1;
  var negative = ether.substring(0, 1) === '-';
  if (negative) {
    ether = ether.substring(1);
  }
  if (ether === '.') {
    throw new Error('[rbtc-unit] while converting number ' + etherInput + ' to wei, invalid value');
  }
  var comps = ether.split('.');
  if (comps.length > 2) {
    throw new Error('[rbtc-unit] while converting number ' + etherInput + ' to wei,  too many decimal points');
  }
  var whole = comps[0];
  var fraction = comps[1];
  if (!whole) {
    whole = '0';
  }
  if (!fraction) {
    fraction = '0';
  }
  if (fraction.length > baseLength) {
    throw new Error('[rbtc-unit] while converting number ' + etherInput + ' to wei, too many decimal places');
  }
  while (fraction.length < baseLength) {
    fraction += '0';
  }
  whole = new BN(whole);
  fraction = new BN(fraction);
  var wei = whole.mul(base).add(fraction);
  if (negative) {
    wei = wei.mul(negative1);
  }
  return new BN(wei.toString(10), 10);
}

var rskUnit = /*#__PURE__*/Object.freeze({
    unitMap: unitMap,
    numberToString: numberToString,
    getValueOfUnit: getValueOfUnit,
    fromWei: fromWei,
    toWei: toWei
});

const {
  unitMap: unitMap$1
} = rskUnit;
const randomHex = size => {
  return '0x' + randombytes(size).toString('hex');
};
const jsonInterfaceMethodToString = json => {
  if (isObject(json) && json.name && json.name.includes('(')) {
    return json.name;
  }
  return `${json.name}(${_flattenTypes(false, json.inputs).join(',')})`;
};
const _flattenTypes = (includeTuple, puts) => {
  const types = [];
  puts.forEach(param => {
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
      if (isArray(result) && includeTuple) {
        types.push(`tuple(${result.join(',')})${suffix}`);
      } else if (!includeTuple) {
        types.push(`(${result.join(',')})${suffix}`);
      } else {
        types.push(`(${result})`);
      }
    } else {
      types.push(param.type);
    }
  });
  return types;
};
const isBN = object => {
  return BN.isBN(object);
};
const KECCAK256_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';
const keccak256 = value => {
  if (isHexStrict(value) && /^0x/i.test(value.toString())) {
    value = hexToBytes(value);
  }
  const returnValue = Hash.keccak256(value);
  if (returnValue === KECCAK256_NULL_S) {
    return null;
  } else {
    return returnValue;
  }
};
keccak256._Hash = Hash;
const toBN = number => {
  try {
    return numberToBN(number);
  } catch (error) {
    throw new Error(`${error} Given value: "${number}"`);
  }
};
const isHex = hex => {
  return (isString(hex) || isNumber(hex)) && /^(-0x|0x)?[0-9a-f]*$/i.test(hex);
};
const isHexStrict = hex => {
  return (isString(hex) || isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex);
};
const isAddress = (address, chainId = null) => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false;
  } else if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
    return true;
  } else {
    return checkAddressChecksum(address, chainId);
  }
};
function toChecksumAddress(address, chainId = null) {
  if (typeof address !== 'string') {
    return '';
  }
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) throw new Error(`Given address "${address}" is not a valid Ethereum address.`);
  const stripAddress = stripHexPrefix(address).toLowerCase();
  const prefix = chainId != null ? chainId.toString() + '0x' : '';
  const keccakHash = Hash.keccak256(prefix + stripAddress).toString('hex').replace(/^0x/i, '');
  let checksumAddress = '0x';
  for (let i = 0; i < stripAddress.length; i++) checksumAddress += parseInt(keccakHash[i], 16) >= 8 ? stripAddress[i].toUpperCase() : stripAddress[i];
  return checksumAddress;
}
const stripHexPrefix = string => {
  return string.startsWith('0x') || string.startsWith('0X') ? string.slice(2) : string;
};
const checkAddressChecksum = (address, chainId = null) => {
  const stripAddress = stripHexPrefix(address).toLowerCase();
  const prefix = chainId != null ? chainId.toString() + '0x' : '';
  const keccakHash = Hash.keccak256(prefix + stripAddress).toString('hex').replace(/^0x/i, '');
  for (let i = 0; i < stripAddress.length; i++) {
    const output = parseInt(keccakHash[i], 16) >= 8 ? stripAddress[i].toUpperCase() : stripAddress[i];
    if (stripHexPrefix(address)[i] !== output) {
      return false;
    }
  }
  return true;
};
const toHex = (value, returnType) => {
  if (isAddress(value)) {
    return returnType ? 'address' : `0x${value.toLowerCase().replace(/^0x/i, '')}`;
  }
  if (isBoolean(value)) {
    return returnType ? 'bool' : value ? '0x01' : '0x00';
  }
  if (isObject(value) && !isBN(value)) {
    return returnType ? 'string' : utf8ToHex(JSON.stringify(value));
  }
  if (isString(value)) {
    if (value.indexOf('-0x') === 0 || value.indexOf('-0X') === 0) {
      return returnType ? 'int256' : numberToHex(value);
    } else if (value.indexOf('0x') === 0 || value.indexOf('0X') === 0) {
      return returnType ? 'bytes' : value;
    } else if (!isFinite(value)) {
      return returnType ? 'string' : utf8ToHex(value);
    }
  }
  return returnType ? value < 0 ? 'int256' : 'uint256' : numberToHex(value);
};
const hexToNumberString = value => {
  if (!value) return value;
  if (isString(value)) {
    if (!isHexStrict(value)) throw new Error(`Given value "${value}" is not a valid hex string.`);
  }
  return toBN(value).toString(10);
};
const hexToNumber = value => {
  if (!value) {
    return value;
  }
  return toBN(value).toNumber();
};
const numberToHex = value => {
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
const hexToUtf8 = hex => {
  if (!isHexStrict(hex)) throw new Error(`The parameter "${hex}" must be a valid HEX string.`);
  let string = '';
  let code = 0;
  hex = hex.replace(/^0x/i, '');
  hex = hex.replace(/^(?:00)*/, '');
  hex = hex.split('').reverse().join('');
  hex = hex.replace(/^(?:00)*/, '');
  hex = hex.split('').reverse().join('');
  const l = hex.length;
  for (let i = 0; i < l; i += 2) {
    code = parseInt(hex.substr(i, 2), 16);
    string += String.fromCharCode(code);
  }
  return utf8.decode(string);
};
const hexToAscii = hex => {
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
const utf8ToHex = value => {
  value = utf8.encode(value);
  let hex = '';
  value = value.replace(/^(?:\u0000)*/, '');
  value = value.split('').reverse().join('');
  value = value.replace(/^(?:\u0000)*/, '');
  value = value.split('').reverse().join('');
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    const n = code.toString(16);
    hex += n.length < 2 ? `0${n}` : n;
  }
  return `0x${hex}`;
};
const asciiToHex = (value, length = 32) => {
  let hex = '';
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    const n = code.toString(16);
    hex += n.length < 2 ? `0${n}` : n;
  }
  return '0x' + padRight(hex, length * 2);
};
const hexToBytes = hex => {
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
const bytesToHex = bytes => {
  const hex = [];
  for (const element of bytes) {
    hex.push((element >>> 4).toString(16));
    hex.push((element & 0xf).toString(16));
  }
  return `0x${hex.join('').replace(/^0+/, '')}`;
};
const toWei$1 = (number, unit) => {
  unit = getUnitValue(unit);
  if (!isBN(number) && !isString(number)) {
    throw new Error('Please pass numbers as strings or BN objects to avoid precision errors.');
  }
  return isBN(number) ? toWei(number, unit) : toWei(number, unit).toString(10);
};
const getUnitValue = unit => {
  unit = unit ? unit.toLowerCase() : 'ether';
  if (!unitMap[unit]) {
    throw new Error(`This unit "${unit}" doesn't exist, please use the one of the following units${JSON.stringify(unitMap, null, 2)}`);
  }
  return unit;
};
const fromWei$1 = (number, unit) => {
  unit = getUnitValue(unit);
  if (!isBN(number) && !isString(number)) {
    throw new Error('Please pass numbers as strings or BN objects to avoid precision errors.');
  }
  return isBN(number) ? fromWei(number, unit) : fromWei(number, unit).toString(10);
};
const padRight = (string, chars, sign) => {
  const hasPrefix = /^0x/i.test(string) || typeof string === 'number';
  string = string.toString(16).replace(/^0x/i, '');
  const padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;
  return (hasPrefix ? '0x' : '') + string + new Array(padding).join(sign || '0');
};
const padLeft = (string, chars, sign) => {
  const hasPrefix = /^0x/i.test(string) || typeof string === 'number';
  string = string.toString(16).replace(/^0x/i, '');
  const padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;
  return (hasPrefix ? '0x' : '') + new Array(padding).join(sign || '0') + string;
};
const toTwosComplement = number => {
  return `0x${toBN(number).toTwos(256).toString(16, 64)}`;
};
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
const keyBtcToRskInBytes = btcPrivateKey => {
  var decodedKey = bs58.decode(btcPrivateKey);
  var keyInBytes = decodedKey.slice(1, decodedKey.length - 5);
  return keyInBytes;
};
const privateKeyToRskFormat = btcPrivateKey => {
  const keyInBytes = keyBtcToRskInBytes(btcPrivateKey);
  const privKeyInRskFormat = Buffer.from(keyInBytes).toString('hex');
  return privKeyInRskFormat;
};
const getRskAddress = btcPrivateKey => {
  const myWallet = wallet.fromPrivateKey(Buffer.from(keyBtcToRskInBytes(btcPrivateKey)));
  const addressInRskFormat = myWallet.getAddress();
  return addressInRskFormat.toString('hex');
};
const getBtcPrivateKey = (btcNetworkType, rskPrivateKey) => {
  const keyByteArray = convertHex.hexToBytes(rskPrivateKey);
  const partialResult = [];
  const result = [];
  if (btcNetworkType === 'MAIN_NET') {
    partialResult.push(0x80);
  } else {
    partialResult.push(0xef);
  }
  for (const element of keyByteArray) {
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
  const bufferResult = Buffer.from(result);
  return bs58.encode(bufferResult);
};
const _elementaryName = name => {
  if (name.startsWith('int[')) {
    return `int256${name.slice(3)}`;
  }
  if (name === 'int') {
    return 'int256';
  }
  if (name.startsWith('uint[')) {
    return `uint256${name.slice(4)}`;
  }
  if (name === 'uint') {
    return 'uint256';
  }
  if (name.startsWith('fixed[')) {
    return `fixed128x128${name.slice(5)}`;
  }
  if (name === 'fixed') {
    return 'fixed128x128';
  }
  if (name.startsWith('ufixed[')) {
    return `ufixed128x128${name.slice(6)}`;
  }
  if (name === 'ufixed') {
    return 'ufixed128x128';
  }
  return name;
};
const _parseTypeN = type => {
  const typesize = /^\D+(\d+).*$/.exec(type);
  return typesize ? parseInt(typesize[1], 10) : null;
};
const _parseTypeNArray = type => {
  const arraySize = /^\D+\d*\[(\d+)\]$/.exec(type);
  return arraySize ? parseInt(arraySize[1], 10) : null;
};
const _parseNumber = argument => {
  const type = typeof argument;
  if (type === 'string') {
    if (isHexStrict(argument)) {
      return new BN(argument.replace(/0x/i, ''), 16);
    } else {
      return new BN(argument, 10);
    }
  } else if (type === 'number') {
    return new BN(argument);
  } else if (isBN(argument)) {
    return argument;
  } else {
    throw new Error(`${argument} is not a number`);
  }
};
const _solidityPack = (type, value, arraySize) => {
  let size, number;
  type = _elementaryName(type);
  if (type === 'bytes') {
    if (value.replace(/^0x/i, '').length % 2 !== 0) {
      throw new Error(`Invalid bytes characters ${value.length}`);
    }
    return value;
  } else if (type === 'string') {
    return utf8ToHex(value);
  } else if (type === 'bool') {
    return value ? '01' : '00';
  } else if (type.startsWith('address')) {
    if (arraySize) {
      size = 64;
    } else {
      size = 40;
    }
    if (!isAddress(value)) {
      throw new Error(`${value} is not a valid address, or the checksum is invalid.`);
    }
    return padLeft(value.toLowerCase(), size);
  }
  size = _parseTypeN(type);
  if (type.startsWith('bytes')) {
    if (!size) {
      throw new Error('bytes[] not yet supported in solidity');
    }
    if (arraySize) {
      size = 32;
    }
    if (size < 1 || size > 32 || size < value.replace(/^0x/i, '').length / 2) {
      throw new Error(`Invalid bytes${size} for ${value}`);
    }
    return padRight(value, size * 2);
  } else if (type.startsWith('uint')) {
    if (size % 8 || size < 8 || size > 256) {
      throw new Error(`Invalid uint${size} size`);
    }
    number = _parseNumber(value);
    if (number.bitLength() > size) {
      throw new Error(`Supplied uint exceeds width: ${size} vs ${number.bitLength()}`);
    }
    if (number.lt(new BN(0))) {
      throw new Error(`Supplied uint ${number.toString()} is negative`);
    }
    return size ? padLeft(number.toString('hex'), size / 8 * 2) : number;
  } else if (type.startsWith('int')) {
    if (size % 8 || size < 8 || size > 256) {
      throw new Error(`Invalid int${size} size`);
    }
    number = _parseNumber(value);
    if (number.bitLength() > size) {
      throw new Error(`Supplied int exceeds width: ${size} vs ${number.bitLength()}`);
    }
    if (number.lt(new BN(0))) {
      return number.toTwos(size).toString('hex');
    } else {
      return size ? padLeft(number.toString('hex'), size / 8 * 2) : number;
    }
  } else {
    throw new Error(`Unsupported or invalid type: ${type}`);
  }
};
const _processSoliditySha3Arguments = argument => {
  if (isArray(argument)) {
    throw new Error('Autodetection of array types is not supported.');
  }
  let type;
  let value = '';
  let hexArgument, arraySize;
  if (isObject(argument) && (has(argument, 'v') || has(argument, 't') || has(argument, 'value') || has(argument, 'type'))) {
    type = has(argument, 't') ? argument.t : argument.type;
    value = has(argument, 'v') ? argument.v : argument.value;
  } else {
    type = toHex(argument, true);
    value = toHex(argument);
    if (!type.startsWith('int') && !type.startsWith('uint')) {
      type = 'bytes';
    }
  }
  if ((type.startsWith('int') || type.startsWith('uint')) && typeof value === 'string' && !/^(-)?0x/i.test(value)) {
    value = new BN(value);
  }
  if (isArray(value)) {
    arraySize = _parseTypeNArray(type);
    if (arraySize && value.length !== arraySize) {
      throw new Error(`${type} is not matching the given array ${JSON.stringify(value)}`);
    } else {
      arraySize = value.length;
    }
  }
  if (isArray(value)) {
    hexArgument = value.map(value_ => {
      return _solidityPack(type, value_, arraySize).toString('hex').replace('0x', '');
    });
    return hexArgument.join('');
  } else {
    hexArgument = _solidityPack(type, value, arraySize);
    return hexArgument.toString('hex').replace('0x', '');
  }
};
const soliditySha3 = function () {
  const arguments_ = Array.prototype.slice.call(arguments);
  const hexArguments = map(arguments_, _processSoliditySha3Arguments);
  return keccak256(`0x${hexArguments.join('')}`);
};

export { asciiToHex, bytesToHex, checkAddressChecksum, asciiToHex as fromAscii, numberToHex as fromDecimal, utf8ToHex as fromUtf8, fromWei$1 as fromWei, getBtcPrivateKey, getRskAddress, getSignatureParameters, hexToAscii, hexToBytes, hexToNumber, hexToNumberString, hexToUtf8 as hexToString, hexToUtf8, isAddress, isBN, isHex, isHexStrict, jsonInterfaceMethodToString, keccak256, padLeft as leftPad, numberToHex, padLeft, padRight, privateKeyToRskFormat, randomHex, padRight as rightPad, keccak256 as sha3, soliditySha3, utf8ToHex as stringToHex, stripHexPrefix, hexToAscii as toAscii, toBN, toChecksumAddress, hexToNumber as toDecimal, toHex, toTwosComplement, hexToUtf8 as toUtf8, toWei$1 as toWei, unitMap$1 as unitMap, utf8ToHex };
