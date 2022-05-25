import { formatKebabToCamelCase } from './format-kebab-to-camel-case';

const pairs: [string, string, string][] = [
  ['formats kebab case to camel case', 'text-align', 'textAlign'],
  [
    'sanitizes consecutive, prefix, and suffix hyphens',
    '-text--align-',
    'textAlign'
  ],
  ['sanitizes any non-word characters', 't.e[]x{}t - a!l@i#g$n', 'textAlign']
];

describe('formatKebabToCamelCase', () => {
  test.each(pairs)('%s', (_, string, expected) => {
    expect(formatKebabToCamelCase(string)).toBe(expected);
  });
});
