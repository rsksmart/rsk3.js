import { toDecimal } from '../src';

/**
 * Utils test
 */
describe('UtilsTest', () => {
  it('calls toDecimal and returns the expected results', () => {
    const tests = [
      {
        value: 'myString',
        expected: '0x6d79537472696e67000000000000000000000000000000000000000000000000'
      }
    ];

    tests.forEach(test => {
      expect(toDecimal(test.value)).toEqual(test.expected);
    });
  });
});
