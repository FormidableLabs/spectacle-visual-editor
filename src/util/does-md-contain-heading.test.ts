import { doesMdContainHeader } from './does-md-contain-heading';

/**
 * [MD Content, Contains List?] pairs to run through our function
 */
const pairs = [
  [`# I'm a header`, true],
  [`#I'm a header`, false],
  [`- This is a list with a # header in it `, false],
  [`## I'm a header`, true],
  [`### I'm a header`, true],
  [`#### I'm a header`, true],
  [`##### I'm a header`, true],
  [`###### I'm a header`, true],
  [`####### I'm a header`, false],
  [`Hello I'm text ####### I'm a header`, false],
  [`Hello I'm text ###### I'm a header`, false],
  [`Hello\n## I'm a header on second line`, true]
];

describe('doesMdContainList', () => {
  it.each(pairs)('doesMdContainList(%p)', (content, expected) => {
    expect(doesMdContainHeader(String(content))).toBe(expected);
  });
});
