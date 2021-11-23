import 'evergreen-ui';

/*
  This is a temporary type declaration file, necessary as evergreen-ui does not current export a typed theme object
  https://github.com/segmentio/evergreen/issues/1209
*/

declare module 'evergreen-ui' {
  interface Theme extends CustomTheme {}
}

/* Converted defaultTheme object to an interfaces */
type Components =
  | 'Alert'
  | 'Avatar'
  | 'Badge'
  | 'Button'
  | 'Card'
  | 'Checkbox'
  | 'Code'
  | 'Group'
  | 'Heading'
  | 'Icon'
  | 'InlineAlert'
  | 'Input'
  | 'List'
  | 'Link'
  | 'MenuItem'
  | 'Pane'
  | 'Paragraph'
  | 'Radio'
  | 'Select'
  | 'Spinner'
  | 'Switch'
  | 'Tab'
  | 'TableCell'
  | 'TableHead'
  | 'TableRow'
  | 'TagInput'
  | 'Text'
  | 'TextDropdownButton'
  | 'Tooltip';

interface CustomTheme {
  tokens: never; // deprecated, see https://github.com/segmentio/evergreen/blob/master/src/themes/default/index.js#L7-L8
  colors: {
    gray900: string;
    gray800: string;
    gray700: string;
    gray600: string;
    gray500: string;
    gray400: string;
    gray300: string;
    gray200: string;
    gray100: string;
    gray90: string;
    gray75: string;
    gray50: string;
    blue900: string;
    blue800: string;
    blue700: string;
    blue600: string;
    blue500: string;
    blue400: string;
    blue300: string;
    blue200: string;
    blue100: string;
    blue50: string;
    blue25: string;
    red700: string;
    red600: string;
    red500: string;
    red300: string;
    red100: string;
    red25: string;
    green900: string;
    green800: string;
    green700: string;
    green600: string;
    green500: string;
    green400: string;
    green300: string;
    green200: string;
    green100: string;
    green25: string;
    orange700: string;
    orange500: string;
    orange100: string;
    orange25: string;
    purple600: string;
    purple100: string;
    teal800: string;
    teal100: string;
    yellow800: string;
    yellow100: string;
    muted: string;
    default: string;
    dark: string;
    selected: string;
    tint1: string;
    tint2: string;
    overlay: string;
    yellowTint: string;
    greenTint: string;
    orangeTint: string;
    redTint: string;
    blueTint: string;
    purpleTint: string;
    tealTint: string;
    border: {
      default: string;
      muted: string;
    };
    icon: {
      default: string;
      muted: string;
      disabled: string;
      selected: string;
    };
    text: {
      danger: string;
      success: string;
      info: string;
    };
    white: string;
  };
  fills: {
    neutral: {
      color: string;
      backgroundColor: string;
    };
    blue: {
      color: string;
      backgroundColor: string;
    };
    red: {
      color: string;
      backgroundColor: string;
    };
    orange: {
      color: string;
      backgroundColor: string;
    };
    yellow: {
      color: string;
      backgroundColor: string;
    };
    green: {
      color: string;
      backgroundColor: string;
    };
    teal: {
      color: string;
      backgroundColor: string;
    };
    purple: {
      color: string;
      backgroundColor: string;
    };
  };
  intents: {
    info: {
      background: string;
      border: string;
      text: string;
      icon: string;
    };
    success: {
      background: string;
      border: string;
      text: string;
      icon: string;
    };
    warning: {
      background: string;
      border: string;
      text: string;
      icon: string;
    };
    danger: {
      background: string;
      border: string;
      text: string;
      icon: string;
    };
  };
  radii: { 0: string; 1: string; 2: string };
  shadows: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
  };
  fontFamilies: {
    display: string;
    ui: string;
    mono: string;
  };
  fontSizes: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
  };
  fontWeights: {
    light: number;
    normal: number;
    semibold: number;
    bold: number;
  };
  letterSpacings: {
    tightest: string;
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
  };
  lineHeights: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
  };
  zIndices: {
    focused: number;
    stack: number;
    positioner: number;
    overlay: number;
    toaster: number;
  };
  components: {
    [Component in Components]: {
      baseStyle: Record<string, any>;
      appearances: {
        [key: string]: Record<string, any>;
      };
      sizes: {
        [key in 'small' | 'medium' | 'large' | string]: Record<string, any>;
      };
    };
  };
}
