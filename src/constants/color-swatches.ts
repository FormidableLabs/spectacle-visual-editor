import { defaultTheme } from 'evergreen-ui';

export const SWATCH_NAMES = {
  THEME_COLORS: 'Theme Colors',
  DEFAULT_COLORS: 'Default Colors'
};

// Sort Evergreen UI color palette into types
const THEME_COLORS_BY_TYPE = Object.values(defaultTheme.palette).reduce<
  Record<string, string[]>
>((colorTypes, color) => {
  const newColorTypes = { ...colorTypes };
  newColorTypes.dark = [...(colorTypes.dark || []), color.dark];
  newColorTypes.base = [...(colorTypes.base || []), color.base];
  newColorTypes.light = [...(colorTypes.light || []), color.light];
  newColorTypes.lightest = [...(colorTypes.lightest || []), color.lightest];
  return newColorTypes;
}, {});

// Flatten sorted object so that colors can be mapped over
export const DEFAULT_COLORS = Object.values(THEME_COLORS_BY_TYPE).reduce(
  (allColors: string[], colorType: string[]) => [...allColors, ...colorType],
  []
);
