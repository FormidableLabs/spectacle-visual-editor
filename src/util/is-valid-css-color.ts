import { colord } from 'colord';

export const isValidCSSColor = (color: string) => {
  if (!color) {
    return false;
  }

  return colord(color).isValid();
};
