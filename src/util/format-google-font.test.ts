import { formatGoogleFont } from './format-google-font';

describe('formatGoogleFont', () => {
  it('formats a font with normal and italic weights', () => {
    expect(formatGoogleFont('Lato', ['400', '700'], ['400', '700'])).toEqual(
      'Lato:400,700,400italic,700italic'
    );
  });

  it('formats a font without italic weights', () => {
    expect(formatGoogleFont('Lato', ['400', '700'])).toEqual('Lato:400,700');
  });

  it('formats a font without any weights', () => {
    expect(formatGoogleFont('Lato')).toEqual('Lato');
  });
});
