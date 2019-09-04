(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@babel/runtime/helpers/typeof'), require('number-to-bn'), require('lodash/isString'), require('lodash/isNumber'), require('lodash/isNull'), require('lodash/isUndefined'), require('lodash/isBoolean'), require('lodash/isArray'), require('lodash/isObject'), require('utf8'), require('randombytes'), require('bn.js'), require('eth-lib/lib/hash'), require('lodash/map'), require('lodash/has'), require('bs58'), require('ethereumjs-wallet'), require('convert-hex'), require('js-sha256')) :
    typeof define === 'function' && define.amd ? define(['exports', '@babel/runtime/helpers/typeof', 'number-to-bn', 'lodash/isString', 'lodash/isNumber', 'lodash/isNull', 'lodash/isUndefined', 'lodash/isBoolean', 'lodash/isArray', 'lodash/isObject', 'utf8', 'randombytes', 'bn.js', 'eth-lib/lib/hash', 'lodash/map', 'lodash/has', 'bs58', 'ethereumjs-wallet', 'convert-hex', 'js-sha256'], factory) :
    (global = global || self, factory(global.Rsk3Utils = {}, global._typeof, global.numberToBN, global.isString, global.isNumber, global.isNull, global.isUndefined, global.isBoolean, global.isArray, global.isObject, global.utf8, global.randombytes, global.BN, global.Hash, global.map, global.has, global.bs58, global.wallet, global.convertHex, global.sha256));
}(this, function (exports, _typeof, numberToBN, isString, isNumber, isNull, isUndefined, isBoolean, isArray, isObject, utf8, randombytes, BN, Hash, map, has, bs58, wallet, convertHex, sha256) { 'use strict';

    _typeof = _typeof && _typeof.hasOwnProperty('default') ? _typeof['default'] : _typeof;
    numberToBN = numberToBN && numberToBN.hasOwnProperty('default') ? numberToBN['default'] : numberToBN;
    isString = isString && isString.hasOwnProperty('default') ? isString['default'] : isString;
    isNumber = isNumber && isNumber.hasOwnProperty('default') ? isNumber['default'] : isNumber;
    isNull = isNull && isNull.hasOwnProperty('default') ? isNull['default'] : isNull;
    isUndefined = isUndefined && isUndefined.hasOwnProperty('default') ? isUndefined['default'] : isUndefined;
    isBoolean = isBoolean && isBoolean.hasOwnProperty('default') ? isBoolean['default'] : isBoolean;
    isArray = isArray && isArray.hasOwnProperty('default') ? isArray['default'] : isArray;
    isObject = isObject && isObject.hasOwnProperty('default') ? isObject['default'] : isObject;
    utf8 = utf8 && utf8.hasOwnProperty('default') ? utf8['default'] : utf8;
    randombytes = randombytes && randombytes.hasOwnProperty('default') ? randombytes['default'] : randombytes;
    BN = BN && BN.hasOwnProperty('default') ? BN['default'] : BN;
    Hash = Hash && Hash.hasOwnProperty('default') ? Hash['default'] : Hash;
    map = map && map.hasOwnProperty('default') ? map['default'] : map;
    has = has && has.hasOwnProperty('default') ? has['default'] : has;
    bs58 = bs58 && bs58.hasOwnProperty('default') ? bs58['default'] : bs58;
    wallet = wallet && wallet.hasOwnProperty('default') ? wallet['default'] : wallet;
    convertHex = convertHex && convertHex.hasOwnProperty('default') ? convertHex['default'] : convertHex;
    sha256 = sha256 && sha256.hasOwnProperty('default') ? sha256['default'] : sha256;

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
      } else if (_typeof(argument) === 'object' && argument.toString && (argument.toTwos || argument.dividedToIntegerBy)) {
        if (argument.toPrecision) {
          return String(argument.toPrecision());
        } else {
          return argument.toString(10);
        }
      }
      throw new Error("while converting number to string, invalid number value '" + argument + "' type " + _typeof(argument) + '.');
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

    var unitMap$1 = unitMap;
    var randomHex = function randomHex(size) {
      return '0x' + randombytes(size).toString('hex');
    };
    var jsonInterfaceMethodToString = function jsonInterfaceMethodToString(json) {
      if (isObject(json) && json.name && json.name.includes('(')) {
        return json.name;
      }
      return "".concat(json.name, "(").concat(_flattenTypes(false, json.inputs).join(','), ")");
    };
    var _flattenTypes = function _flattenTypes(includeTuple, puts) {
      var types = [];
      puts.forEach(function (param) {
        if (_typeof(param.components) === 'object') {
          if (param.type.substring(0, 5) !== 'tuple') {
            throw new Error('components found but type is not tuple; report on GitHub');
          }
          var suffix = '';
          var arrayBracket = param.type.indexOf('[');
          if (arrayBracket >= 0) {
            suffix = param.type.substring(arrayBracket);
          }
          var result = _flattenTypes(includeTuple, param.components);
          if (isArray(result) && includeTuple) {
            types.push("tuple(".concat(result.join(','), ")").concat(suffix));
          } else if (!includeTuple) {
            types.push("(".concat(result.join(','), ")").concat(suffix));
          } else {
            types.push("(".concat(result, ")"));
          }
        } else {
          types.push(param.type);
        }
      });
      return types;
    };
    var isBN = function isBN(object) {
      return BN.isBN(object);
    };
    var isBigNumber = function isBigNumber(object) {
      if (isNull(object) || isUndefined(object)) {
        return false;
      }
      return object && object.constructor && object.constructor.name === 'BN';
    };
    var KECCAK256_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';
    var keccak256 = function keccak256(value) {
      if (isHexStrict(value) && /^0x/i.test(value.toString())) {
        value = hexToBytes(value);
      }
      var returnValue = Hash.keccak256(value);
      if (returnValue === KECCAK256_NULL_S) {
        return null;
      } else {
        return returnValue;
      }
    };
    keccak256._Hash = Hash;
    var toBN = function toBN(number) {
      try {
        return numberToBN(number);
      } catch (error) {
        throw new Error("".concat(error, " Given value: \"").concat(number, "\""));
      }
    };
    var isHex = function isHex(hex) {
      return (isString(hex) || isNumber(hex)) && /^(-0x|0x)?[0-9a-f]*$/i.test(hex);
    };
    var isHexStrict = function isHexStrict(hex) {
      return (isString(hex) || isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex);
    };
    var isAddress = function isAddress(address) {
      var chainId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        return false;
      } else if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
        return true;
      } else {
        return checkAddressChecksum(address, chainId);
      }
    };
    function toChecksumAddress(address) {
      var chainId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (typeof address !== 'string') {
        return '';
      }
      if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) throw new Error("Given address \"".concat(address, "\" is not a valid Ethereum address."));
      var stripAddress = stripHexPrefix(address).toLowerCase();
      var prefix = chainId != null ? chainId.toString() + '0x' : '';
      var keccakHash = Hash.keccak256(prefix + stripAddress).toString('hex').replace(/^0x/i, '');
      var checksumAddress = '0x';
      for (var i = 0; i < stripAddress.length; i++) {
        checksumAddress += parseInt(keccakHash[i], 16) >= 8 ? stripAddress[i].toUpperCase() : stripAddress[i];
      }
      return checksumAddress;
    }
    var stripHexPrefix = function stripHexPrefix(string) {
      return string.startsWith('0x') || string.startsWith('0X') ? string.slice(2) : string;
    };
    var checkAddressChecksum = function checkAddressChecksum(address) {
      var chainId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var stripAddress = stripHexPrefix(address).toLowerCase();
      var prefix = chainId != null ? chainId.toString() + '0x' : '';
      var keccakHash = Hash.keccak256(prefix + stripAddress).toString('hex').replace(/^0x/i, '');
      for (var i = 0; i < stripAddress.length; i++) {
        var output = parseInt(keccakHash[i], 16) >= 8 ? stripAddress[i].toUpperCase() : stripAddress[i];
        if (stripHexPrefix(address)[i] !== output) {
          return false;
        }
      }
      return true;
    };
    var toHex = function toHex(value, returnType) {
      if (isAddress(value)) {
        return returnType ? 'address' : "0x".concat(value.toLowerCase().replace(/^0x/i, ''));
      }
      if (isBoolean(value)) {
        return returnType ? 'bool' : value ? '0x01' : '0x00';
      }
      if (isObject(value) && !isBigNumber(value) && !isBN(value)) {
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
    var hexToNumberString = function hexToNumberString(value) {
      if (!value) return value;
      if (isString(value)) {
        if (!isHexStrict(value)) throw new Error("Given value \"".concat(value, "\" is not a valid hex string."));
      }
      return toBN(value).toString(10);
    };
    var hexToNumber = function hexToNumber(value) {
      if (!value) {
        return value;
      }
      return toBN(value).toNumber();
    };
    var numberToHex = function numberToHex(value) {
      if (isNull(value) || typeof value === 'undefined') {
        return value;
      }
      if (!isFinite(value) && !isHexStrict(value)) {
        throw new Error("Given input \"".concat(value, "\" is not a number."));
      }
      var number = toBN(value);
      var result = number.toString(16);
      return number.lt(new BN(0)) ? "-0x".concat(result.substr(1)) : "0x".concat(result);
    };
    var hexToUtf8 = function hexToUtf8(hex) {
      if (!isHexStrict(hex)) throw new Error("The parameter \"".concat(hex, "\" must be a valid HEX string."));
      var string = '';
      var code = 0;
      hex = hex.replace(/^0x/i, '');
      hex = hex.replace(/^(?:00)*/, '');
      hex = hex.split('').reverse().join('');
      hex = hex.replace(/^(?:00)*/, '');
      hex = hex.split('').reverse().join('');
      var l = hex.length;
      for (var i = 0; i < l; i += 2) {
        code = parseInt(hex.substr(i, 2), 16);
        string += String.fromCharCode(code);
      }
      return utf8.decode(string);
    };
    var hexToAscii = function hexToAscii(hex) {
      if (!isHexStrict(hex)) throw new Error('The parameter must be a valid HEX string.');
      var value = '';
      var i = 0;
      var l = hex.length;
      if (hex.substring(0, 2) === '0x') {
        i = 2;
      }
      for (; i < l; i += 2) {
        var code = parseInt(hex.substr(i, 2), 16);
        value += String.fromCharCode(code);
      }
      return value;
    };
    var utf8ToHex = function utf8ToHex(value) {
      value = utf8.encode(value);
      var hex = '';
      value = value.replace(/^(?:\u0000)*/, '');
      value = value.split('').reverse().join('');
      value = value.replace(/^(?:\u0000)*/, '');
      value = value.split('').reverse().join('');
      for (var i = 0; i < value.length; i++) {
        var code = value.charCodeAt(i);
        var n = code.toString(16);
        hex += n.length < 2 ? "0".concat(n) : n;
      }
      return "0x".concat(hex);
    };
    var asciiToHex = function asciiToHex(value) {
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 32;
      var hex = '';
      for (var i = 0; i < value.length; i++) {
        var code = value.charCodeAt(i);
        var n = code.toString(16);
        hex += n.length < 2 ? "0".concat(n) : n;
      }
      return '0x' + padRight(hex, length * 2);
    };
    var hexToBytes = function hexToBytes(hex) {
      hex = hex.toString(16);
      if (!isHexStrict(hex)) {
        throw new Error("Given value \"".concat(hex, "\" is not a valid hex string."));
      }
      hex = hex.replace(/^0x/i, '');
      hex = hex.length % 2 ? '0' + hex : hex;
      var bytes = [];
      for (var c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
      }
      return bytes;
    };
    var bytesToHex = function bytesToHex(bytes) {
      var hex = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;
      try {
        for (var _iterator = bytes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var element = _step.value;
          hex.push((element >>> 4).toString(16));
          hex.push((element & 0xf).toString(16));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
      return "0x".concat(hex.join('').replace(/^0+/, ''));
    };
    var toWei$1 = function toWei$1(number, unit) {
      unit = getUnitValue(unit);
      if (!isBN(number) && !isString(number)) {
        throw new Error('Please pass numbers as strings or BN objects to avoid precision errors.');
      }
      return isBN(number) ? toWei(number, unit) : toWei(number, unit).toString(10);
    };
    var getUnitValue = function getUnitValue(unit) {
      unit = unit ? unit.toLowerCase() : 'ether';
      if (!unitMap[unit]) {
        throw new Error("This unit \"".concat(unit, "\" doesn't exist, please use the one of the following units").concat(JSON.stringify(unitMap, null, 2)));
      }
      return unit;
    };
    var fromWei$1 = function fromWei$1(number, unit) {
      unit = getUnitValue(unit);
      if (!isBN(number) && !isString(number)) {
        throw new Error('Please pass numbers as strings or BN objects to avoid precision errors.');
      }
      return isBN(number) ? fromWei(number, unit) : fromWei(number, unit).toString(10);
    };
    var padRight = function padRight(string, chars, sign) {
      var hasPrefix = /^0x/i.test(string) || typeof string === 'number';
      string = string.toString(16).replace(/^0x/i, '');
      var padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;
      return (hasPrefix ? '0x' : '') + string + new Array(padding).join(sign || '0');
    };
    var padLeft = function padLeft(string, chars, sign) {
      var hasPrefix = /^0x/i.test(string) || typeof string === 'number';
      string = string.toString(16).replace(/^0x/i, '');
      var padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;
      return (hasPrefix ? '0x' : '') + new Array(padding).join(sign || '0') + string;
    };
    var toTwosComplement = function toTwosComplement(number) {
      return "0x".concat(toBN(number).toTwos(256).toString(16, 64));
    };
    var getSignatureParameters = function getSignatureParameters(signature) {
      if (!isHexStrict(signature)) {
        throw new Error("Given value \"".concat(signature, "\" is not a valid hex string."));
      }
      var r = signature.slice(0, 66);
      var s = "0x".concat(signature.slice(66, 130));
      var v = "0x".concat(signature.slice(130, 132));
      v = hexToNumber(v);
      if (![27, 28].includes(v)) v += 27;
      return {
        r: r,
        s: s,
        v: v
      };
    };
    var keyBtcToRskInBytes = function keyBtcToRskInBytes(btcPrivateKey) {
      var decodedKey = bs58.decode(btcPrivateKey);
      var privKeyBytes = decodedKey.slice(1, decodedKey.length - 5);
      return privKeyBytes;
    };
    var privateKeyToRskFormat = function privateKeyToRskFormat(btcPrivateKey) {
      var privKeyBytes = keyBtcToRskInBytes(btcPrivateKey);
      var privKeyInRskFormat = Buffer.from(privKeyBytes).toString('hex');
      return privKeyInRskFormat;
    };
    var getRskAddress = function getRskAddress(btcPrivateKey) {
      var myWallet = wallet.fromPrivateKey(Buffer.from(keyBtcToRskInBytes(btcPrivateKey)));
      var addressInRskFormat = myWallet.getAddress();
      return addressInRskFormat.toString('hex');
    };
    var getBtcPrivateKey = function getBtcPrivateKey(btcNet, rskAddress) {
      var addressArray = convertHex.hexToBytes(rskAddress);
      var partialResult = [];
      var result = [];
      if (btcNet === 'MAIN_NET') {
        partialResult.push(0x80);
      } else {
        partialResult.push(0xef);
      }
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;
      try {
        for (var _iterator2 = addressArray[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var element = _step2.value;
          partialResult.push(element);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
      partialResult.push(0x01);
      var check = convertHex.hexToBytes(sha256(convertHex.hexToBytes(sha256(partialResult))));
      for (var _i = 0, _partialResult = partialResult; _i < _partialResult.length; _i++) {
        var _element = _partialResult[_i];
        result.push(_element);
      }
      for (var i = 0; i < 4; i++) {
        result.push(check[i]);
      }
      var bufferResult = Buffer.from(result);
      return bs58.encode(bufferResult);
    };
    var _elementaryName = function _elementaryName(name) {
      if (name.startsWith('int[')) {
        return "int256".concat(name.slice(3));
      }
      if (name === 'int') {
        return 'int256';
      }
      if (name.startsWith('uint[')) {
        return "uint256".concat(name.slice(4));
      }
      if (name === 'uint') {
        return 'uint256';
      }
      if (name.startsWith('fixed[')) {
        return "fixed128x128".concat(name.slice(5));
      }
      if (name === 'fixed') {
        return 'fixed128x128';
      }
      if (name.startsWith('ufixed[')) {
        return "ufixed128x128".concat(name.slice(6));
      }
      if (name === 'ufixed') {
        return 'ufixed128x128';
      }
      return name;
    };
    var _parseTypeN = function _parseTypeN(type) {
      var typesize = /^\D+(\d+).*$/.exec(type);
      return typesize ? parseInt(typesize[1], 10) : null;
    };
    var _parseTypeNArray = function _parseTypeNArray(type) {
      var arraySize = /^\D+\d*\[(\d+)\]$/.exec(type);
      return arraySize ? parseInt(arraySize[1], 10) : null;
    };
    var _parseNumber = function _parseNumber(argument) {
      var type = _typeof(argument);
      if (type === 'string') {
        if (isHexStrict(argument)) {
          return new BN(argument.replace(/0x/i, ''), 16);
        } else {
          return new BN(argument, 10);
        }
      } else if (type === 'number') {
        return new BN(argument);
      } else if (isBigNumber(argument)) {
        return new BN(argument.toString(10));
      } else if (isBN(argument)) {
        return argument;
      } else {
        throw new Error("".concat(argument, " is not a number"));
      }
    };
    var _solidityPack = function _solidityPack(type, value, arraySize) {
      var size, number;
      type = _elementaryName(type);
      if (type === 'bytes') {
        if (value.replace(/^0x/i, '').length % 2 !== 0) {
          throw new Error("Invalid bytes characters ".concat(value.length));
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
          throw new Error("".concat(value, " is not a valid address, or the checksum is invalid."));
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
          throw new Error("Invalid bytes".concat(size, " for ").concat(value));
        }
        return padRight(value, size * 2);
      } else if (type.startsWith('uint')) {
        if (size % 8 || size < 8 || size > 256) {
          throw new Error("Invalid uint".concat(size, " size"));
        }
        number = _parseNumber(value);
        if (number.bitLength() > size) {
          throw new Error("Supplied uint exceeds width: ".concat(size, " vs ").concat(number.bitLength()));
        }
        if (number.lt(new BN(0))) {
          throw new Error("Supplied uint ".concat(number.toString(), " is negative"));
        }
        return size ? padLeft(number.toString('hex'), size / 8 * 2) : number;
      } else if (type.startsWith('int')) {
        if (size % 8 || size < 8 || size > 256) {
          throw new Error("Invalid int".concat(size, " size"));
        }
        number = _parseNumber(value);
        if (number.bitLength() > size) {
          throw new Error("Supplied int exceeds width: ".concat(size, " vs ").concat(number.bitLength()));
        }
        if (number.lt(new BN(0))) {
          return number.toTwos(size).toString('hex');
        } else {
          return size ? padLeft(number.toString('hex'), size / 8 * 2) : number;
        }
      } else {
        throw new Error("Unsupported or invalid type: ".concat(type));
      }
    };
    var _processSoliditySha3Arguments = function _processSoliditySha3Arguments(argument) {
      if (isArray(argument)) {
        throw new Error('Autodetection of array types is not supported.');
      }
      var type;
      var value = '';
      var hexArgument, arraySize;
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
          throw new Error("".concat(type, " is not matching the given array ").concat(JSON.stringify(value)));
        } else {
          arraySize = value.length;
        }
      }
      if (isArray(value)) {
        hexArgument = value.map(function (value_) {
          return _solidityPack(type, value_, arraySize).toString('hex').replace('0x', '');
        });
        return hexArgument.join('');
      } else {
        hexArgument = _solidityPack(type, value, arraySize);
        return hexArgument.toString('hex').replace('0x', '');
      }
    };
    var soliditySha3 = function soliditySha3() {
      var arguments_ = Array.prototype.slice.call(arguments);
      var hexArguments = map(arguments_, _processSoliditySha3Arguments);
      return keccak256("0x".concat(hexArguments.join('')));
    };

    exports.BN = BN;
    exports.asciiToHex = asciiToHex;
    exports.bytesToHex = bytesToHex;
    exports.checkAddressChecksum = checkAddressChecksum;
    exports.fromAscii = asciiToHex;
    exports.fromDecimal = numberToHex;
    exports.fromUtf8 = utf8ToHex;
    exports.fromWei = fromWei$1;
    exports.getBtcPrivateKey = getBtcPrivateKey;
    exports.getRskAddress = getRskAddress;
    exports.getSignatureParameters = getSignatureParameters;
    exports.hexToAscii = hexToAscii;
    exports.hexToBytes = hexToBytes;
    exports.hexToNumber = hexToNumber;
    exports.hexToNumberString = hexToNumberString;
    exports.hexToString = hexToUtf8;
    exports.hexToUtf8 = hexToUtf8;
    exports.isAddress = isAddress;
    exports.isBN = isBN;
    exports.isBigNumber = isBigNumber;
    exports.isHex = isHex;
    exports.isHexStrict = isHexStrict;
    exports.jsonInterfaceMethodToString = jsonInterfaceMethodToString;
    exports.keccak256 = keccak256;
    exports.leftPad = padLeft;
    exports.numberToHex = numberToHex;
    exports.padLeft = padLeft;
    exports.padRight = padRight;
    exports.privateKeyToRskFormat = privateKeyToRskFormat;
    exports.randomHex = randomHex;
    exports.rightPad = padRight;
    exports.sha3 = keccak256;
    exports.soliditySha3 = soliditySha3;
    exports.stringToHex = utf8ToHex;
    exports.stripHexPrefix = stripHexPrefix;
    exports.toAscii = hexToAscii;
    exports.toBN = toBN;
    exports.toChecksumAddress = toChecksumAddress;
    exports.toDecimal = hexToNumber;
    exports.toHex = toHex;
    exports.toTwosComplement = toTwosComplement;
    exports.toUtf8 = hexToUtf8;
    exports.toWei = toWei$1;
    exports.unitMap = unitMap$1;
    exports.utf8ToHex = utf8ToHex;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
