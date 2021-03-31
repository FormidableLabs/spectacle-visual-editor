const SUPPORTED_CSS_SUFFIXES = ['px', 'em', 'vh', 'vw'];

export const isValidCSSSize = (size: string | number) => {
  if (typeof size === 'number' && size === 0) {
    return true;
  } else if (typeof size === 'string') {
    if (size === '0') {
      return true;
    }
    const suffix = size.slice(size.length - 2);
    const value = parseFloat(size);
    return !isNaN(value) && SUPPORTED_CSS_SUFFIXES.includes(suffix);
  } else {
    return false;
  }
};
