export const formatKebabToCamelCase = (str: string) => {
  const splitted = str
    .replaceAll(/(-+)/g, '-')
    .replaceAll(/(^-)|(-$)|([^a-zA-Z0-9-]+)/g, '')
    .trim()
    .split('-');
  if (splitted.length === 1) return splitted[0];
  return (
    splitted[0] +
    splitted
      .slice(1)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join('')
  );
};
