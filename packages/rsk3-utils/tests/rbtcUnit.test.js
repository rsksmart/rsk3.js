import {toWei, fromWei, numberToString, getValueOfUnit} from '../src/rbtcUnit.js';
import BigNumber from 'bn.js';

describe('toWei', function() {
    it('calls toWei and returns the expected results', () => {
        expect(toWei('1', 'wei')).toEqual(new BigNumber('1'));

        expect(toWei('1', 'kwei')).toEqual(new BigNumber('1000'));

        expect(toWei('1', 'Kwei')).toEqual(new BigNumber('1000'));

        expect(toWei('1', 'mwei')).toEqual(new BigNumber('1000000'));

        expect(toWei('1', 'Mwei')).toEqual(new BigNumber('1000000'));

        expect(toWei('1', 'gwei')).toEqual(new BigNumber('1000000000'));

        expect(toWei('1', 'Gwei')).toEqual(new BigNumber('1000000000'));

        expect(toWei('1', 'ether')).toEqual(new BigNumber('1000000000000000000'));

        expect(toWei('1', 'kether')).toEqual(new BigNumber('1000000000000000000000'));

        expect(toWei('1', 'mether')).toEqual(new BigNumber('1000000000000000000000000'));

        expect(toWei('1', 'gether')).toEqual(new BigNumber('1000000000000000000000000000'));

        expect(toWei('1', 'tether')).toEqual(new BigNumber('1000000000000000000000000000000'));

        expect(() => {
            toWei(0.01, 'wei');
        }).toThrow(Error);
    });

    it('calls fromWei and returns the expected results', () => {
        expect(fromWei('1000000000000000000', 'wei')).toEqual('1000000000000000000');

        expect(fromWei('1000000000000000000', 'kwei')).toEqual('1000000000000000');

        expect(fromWei('1000000000000000000', 'mwei')).toEqual('1000000000000');

        expect(fromWei('1000000000000000000', 'gwei')).toEqual('1000000000');

        expect(fromWei('1000000000000000000', 'ether')).toEqual('1');

        expect(fromWei('1000000000000000000', 'kether')).toEqual('0.001');

        expect(fromWei('1000000000000000000', 'mether')).toEqual('0.000001');

        expect(fromWei('1000000000000000000', 'gether')).toEqual('0.000000001');

        expect(fromWei('1000000000000000000', 'tether')).toEqual('0.000000000001');

        expect(() => fromWei('1000000000000000000', 'wrong unit')).toThrow(Error);
    });

    describe('numberToString', function() {
        it('should handle error cases', function() {
            const tests = [
                {value: undefined, expected: Error},
                {value: {}, expected: Error},
                {value: [], expected: Error},
                {
                    value: '-1sdffsdsdf',
                    expected:
                        "while converting number to string, invalid number value '-1sdffsdsdf', should be a number matching (^-?[0-9.]+)."
                },
                {
                    value: '-0..-...9',
                    expected:
                        "while converting number to string, invalid number value '-0..-...9', should be a number matching (^-?[0-9.]+)."
                },
                {value: 'fds', expected: Error},
                {value: '', expected: Error},
                {value: '#', expected: Error}
            ];
            tests.forEach((test) => {
                expect(() => numberToString(test.value)).toThrow(test.expected);
            });
        });
        it('should handle right cases', function() {
            const tests = [
                {value: 55, expected: '55'},
                {value: 1, expected: '1'},
                {value: -1, expected: '-1'},
                {value: new BigNumber(10000), expected: '10000'},
                {value: new BigNumber(1), expected: '1'},
                {value: new BigNumber(-1), expected: '-1'},
                {value: new BigNumber(0), expected: '0'}
            ];
            tests.forEach((test) => {
                expect(numberToString(test.value)).toEqual(test.expected);
            });
        });
    });
    describe('getValueOfUnit', function() {
        it('should handle error cases', function() {
            const tests = [{value: 'something', expected: Error}, {value: 'wrongunit', expected: Error}];
            tests.forEach((test) => {
                expect(() => getValueOfUnit(test.value)).toThrow(test.expected);
            });
        });
        it('should handle right cases', function() {
            const tests = [
                {value: 'ether', expected: '1000000000000000000'},
                {value: 'wei', expected: '1'},
                {value: 'tether', expected: '1000000000000000000000000000000'}
            ];
            tests.forEach((test) => {
                expect(getValueOfUnit(test.value)).toEqual(new BigNumber(test.expected, 10));
            });
        });
    });
});
