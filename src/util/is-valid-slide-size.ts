export const isValidSlideSize = (size: string) => {
  const value = parseInt(size);
  return !isNaN(value) && value >= 200;
};
