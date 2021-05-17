/**
 * Check if MD string contains a header
 * ^ start of line
 * #{1, 6} checks for 1 to up to 6 hashes
 * \s any amount of whitespace characters
 * .+s$ followed by any amount text until end of line
 * gm global, multiline
 * @param content String to check
 */
export const doesMdContainHeader = (content: string) =>
  /^#{1,6}\s.+$/gm.test(content);
