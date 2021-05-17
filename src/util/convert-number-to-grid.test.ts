import { convertNumberToGridPercent } from './convert-number-to-grid';

describe('convertNumberToGridPercent', () => {
  test('given valid number and string', () => {
    expect(convertNumberToGridPercent(3, '12px')).toEqual('repeat(3, 12px)');
  });

  test('given valid number, no string', () => {
    expect(convertNumberToGridPercent(4, '')).toEqual('repeat(4, 25%)');
  });

  test('given 0, no string', () => {
    expect(convertNumberToGridPercent(0, '')).toEqual('repeat(0, Infinity%)');
  });
});
