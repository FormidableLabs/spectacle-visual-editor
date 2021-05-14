/* Convert number of columns (integer) to a CSS percentage for grids. 
Will default to evenly spaced percentages if no string input */
export const convertNumberToGridPercent = (number: number, width: string) => {
  return (
    'repeat(' + number + ', ' + (width ? width + ')' : 100 / number + '%)')
  );
};
