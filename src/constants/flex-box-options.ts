// ENUM for specific comparisons
export enum FLEX_DIRECTION {
  column = 'column',
  row = 'row'
}

// Options for mappings
export const FLEX_DIRECTION_OPTIONS: string[] = Object.values(FLEX_DIRECTION);

export enum JUSTIFY_CONTENT {
  FLEX_START = 'flex-start',
  FLEX_END = 'flex-end',
  CENTER = 'center',
  SPACE_BETWEEN = 'space-between',
  SPACE_AROUND = 'space-around',
  SPACE_EVENLY = 'space-evenly'
}

export const JUSTIFY_CONTENT_OPTIONS: string[] = Object.values(JUSTIFY_CONTENT);

export enum ALIGN_ITEMS {
  FLEX_START = 'flex-start',
  FLEX_END = 'flex-end',
  CENTER = 'center',
  STRETCH = 'stretch',
  BASELINE = 'baseline'
}

export const ALIGN_ITEMS_OPTIONS: string[] = Object.values(ALIGN_ITEMS);

export enum FLEX_COMPONENT_PROPS {
  FLEX_DIRECTION = 'flexDirection',
  JUSTIFY_CONTENT = 'justifyContent',
  ALIGN_ITEMS = 'alignItems',
  PADDING = 'padding',
  PADDING_HORIZONTAL = 'paddingX',
  PADDING_VERTICAL = 'paddingY'
}

export enum BORDER_COMPONENT_PROPS {
  BORDER_WIDTH = 'borderWidth',
  BORDER_STYLE = 'borderStyle',
  BORDER_COLOR = 'borderColor',
  BORDER_RADIUS = 'borderRadius'
}

export enum BORDER_STYLES {
  NONE = 'none',
  HIDDEN = 'hidden',
  DOTTED = 'dotted',
  DASHED = 'dashed',
  SOLID = 'solid',
  DOUBLE = 'double',
  GROOVE = 'groove',
  RIDGE = 'ridge',
  INSERT = 'inset',
  OUTSET = 'outset'
}

export const BORDER_STYLE_OPTIONS: string[] = Object.values(BORDER_STYLES);
