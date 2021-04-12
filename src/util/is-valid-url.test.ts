import { isValidUrl } from './is-valid-url';

const pairs: [string, string, boolean][] = [
  ['accepts urls starting with https', 'https://goole.com', true],
  ['rejects urls not starting with https', 'http://google.com', false],
  ['rejects non-url like string', 'foobar', false]
];

describe('isValidUrl', () => {
  test.each(pairs)('%s', (_, content, expected) => {
    expect(isValidUrl(content)).toBe(expected);
  });
});
