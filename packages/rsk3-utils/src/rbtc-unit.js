'use strict';

var BN = require('bn.js');
var numberToBN = require('number-to-bn');

var zero = new BN(0);
var negative1 = new BN(-1);

var unitMap = {
  'wei': '1', 
  'kwei': '1000', 
  'Kwei': '1000', 
  'mwei': '1000000', 
  'Mwei': '1000000', 
  'gwei': '1000000000', 
  'Gwei': '1000000000', 
  'ether': '1000000000000000000', 
  'kether': '1000000000000000000000', 
  'mether': '1000000000000000000000000', 
  'gether': '1000000000000000000000000000', 
  'tether': '1000000000000000000000000000000'
};

/**
 * Returns value of unit in Wei
 *
 * @method getValueOfUnit
 * @param {String} unit the unit to convert to, default ether
 * @returns {BigNumber} value of the unit (in Wei)
 * @throws error if the unit is not correct:w
 */
function getValueOfUnit(unitInput) {
  var unit = unitInput ? unitInput.toLowerCase() : 'ether';
  var unitValue = unitMap[unit]; 

  if (typeof unitValue !== 'string') {
    throw new Error('[rbtc-unit] the unit provided ' + unitInput + ' doesn\'t exists, please use the one of the following units ' + JSON.stringify(unitMap, null, 2));
  }

  return new BN(unitValue, 10);
}

/**
 * Returns value of unit in Wei
 *
 * @method numberToString
 * @param {String|Number|Object} arg need to convert to string number
 * @returns {String} value of the string number
 * @throws error if the arg is invalid
 */
function numberToString(arg) {
  if (typeof arg === 'string') {
    if (!arg.match(/^-?[0-9.]+$/)) {
      throw new Error('while converting number to string, invalid number value \'' + arg + '\', should be a number matching (^-?[0-9.]+).');
    }
    return arg;
  } else if (typeof arg === 'number') {
    return String(arg);
  } else if (typeof arg === 'object' && arg.toString && (arg.toTwos || arg.dividedToIntegerBy)) {
    if (arg.toPrecision) {
      return String(arg.toPrecision());
    } else {
      
      return arg.toString(10);
    }
  }
  throw new Error('while converting number to string, invalid number value \'' + arg + '\' type ' + typeof arg + '.');
}

/**
 * Returns value of unit in Wei
 *
 * @method fromWei
 * @param {String|Number} weiInput the value of unit in wei
 * @param {String} unit the target unit
 * @param {Object} optionsInput the options of Fuction
 * @returns {String} value of the unit
 */
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
    fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
  }

  var whole = wei.div(base).toString(10); 

  if (options.commify) {
    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  var value = '' + whole + (fraction == '0' ? '' : '.' + fraction); 

  if (negative) {
    value = '-' + value;
  }

  return value;
}

/**
 * Returns value of unit in Wei
 *
 * @method toWei
 * @param {String} etherInput the value of unit in ether
 * @param {String} unit the unit want to convert to
 * @returns {BigNumber} value of the unit (in wei)
 * @throws error if the converting value is invalid
 */
function toWei(etherInput, unit) {
  var ether = numberToString(etherInput); 
  var base = getValueOfUnit(unit);
  var baseLength = unitMap[unit].length - 1 || 1;

  // Is it negative?
  var negative = ether.substring(0, 1) === '-'; 
  if (negative) {
    ether = ether.substring(1);
  }

  if (ether === '.') {
    throw new Error('[rbtc-unit] while converting number ' + etherInput + ' to wei, invalid value');
  }

  // Split it into a whole and fractional part
  var comps = ether.split('.'); 
  if (comps.length > 2) {
    throw new Error('[rbtc-unit] while converting number ' + etherInput + ' to wei,  too many decimal points');
  }

  var whole = comps[0],
    fraction = comps[1]; 

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

module.exports = {
  unitMap: unitMap,
  numberToString: numberToString,
  getValueOfUnit: getValueOfUnit,
  fromWei: fromWei,
  toWei: toWei
};