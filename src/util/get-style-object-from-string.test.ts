import { getStyleObjectFromString } from './get-style-object-from-string';

describe('getStyleObjectFromString', () => {
  it('formats style attribute string as object', () => {
    expect(
      getStyleObjectFromString('text-align: left; font-weight: bold')
    ).toEqual({ textAlign: 'left', fontWeight: 'bold' });
  });
});
