const SUFFIX_PATTERN = /\d\s*(px|em|vh|vw|%)/;

export const valueWithCSSUnits = (size: string) => {
  if (typeof size !== 'string') {
    return size;
  }
  if (size === '0') {
    // avoid changing defaults
    return undefined;
  }

  const value = parseFloat(size);
  const isValidValue = !isNaN(value);
  const unitType = size.match(SUFFIX_PATTERN)?.[1];
  const hasUnitType = typeof unitType !== 'undefined';
  if (isValidValue && !hasUnitType) {
    // if value is valid number, but missing unit type, assume and append 'px' to value. will also convert invalid unit to 'px'
    return `${value}px`;
  } else if (hasUnitType) {
    // trim any white space inbetween value and unit e.g. 33 px is only valid css as 33px
    return `${value}${unitType}`;
  }
  return size;
};
