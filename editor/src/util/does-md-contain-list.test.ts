import { doesMdContainList } from './does-md-contain-list';

/**
 * [MD Content, Contains List?] pairs to run through our function
 */
const pairs = [
  [`- I'm a list?`, true],
  [`-I'm a list?`, false],
  [`# Is this tricky title - a list?`, false],
  [
    `
    # With other content
    
    - Lists still work
  `,
    true
  ],
  [`* I'm a list?`, true],
  [`*I'm a list?`, false],
  [`# Is this tricky title * a list?`, false],
  [
    `
    # With other content
    
    * Lists still work
  `,
    true
  ],
  [`+ I'm a list?`, true],
  [`+I'm a list?`, false],
  [`# Is this tricky title + a list?`, false],
  [
    `
    # With other content
    
    + Lists still work
  `,
    true
  ],
  [`1. I'm a list?`, true],
  [`1 I'm a list?`, false],
  [`2. I'm a list?`, true],
  [`# Is this tricky title 1. a list?`, false],
  [
    `
    # With other content
    
    1. Lists still work
    `,
    true
  ]
];

describe('doesMdContainList', () => {
  it.each(pairs)('doesMdContainList(%p)', (content, expected) => {
    expect(doesMdContainList(String(content))).toBe(expected);
  });
});
