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
