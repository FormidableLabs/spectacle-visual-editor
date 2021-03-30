/**
 * Check if MD string contains a list
 * ^\s{0, 4} checks that line starts with 0 to 4 space characters
 * 		(more than 4 spaces will create a different element)
 * (-|\*|\+|\d\.) checks that the line starts with -, *, +, or digit
 * \s checks for a spacing following the bullet
 * @param content String to check
 */
export const doesMdContainList = (content: string) =>
  /^\s{0,4}(-|\*|\+|\d\.)\s/m.test(content);
