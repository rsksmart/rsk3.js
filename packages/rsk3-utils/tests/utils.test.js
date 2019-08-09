import { toDecimal } from '../src';

/**
 * Utils test
 */
describe('UtilsTest', () => {
  it('calls toDecimal and returns the expected results', () => {
    const tests = [
      {
        value: '0x1a',
        expected: 26,
      },
      {
          value:'0x1b',
          expected: 28,
      }
    ];

    tests.forEach(test => {
      expect(toDecimal(test.value)).toEqual(test.expected);
    });
  });
});
