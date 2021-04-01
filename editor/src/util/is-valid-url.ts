export const isValidUrl = (val: string) => {
  try {
    return new URL(val).protocol === 'https:';
  } catch {
    return false;
  }
};
