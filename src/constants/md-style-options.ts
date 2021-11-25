import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  PropertiesIcon,
  NumberedListIcon,
  CitationIcon,
  HeaderOneIcon,
  HeaderTwoIcon,
  HeaderThreeIcon,
  CodeIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon
} from 'evergreen-ui';

export enum HEADING_TYPES {
  H1 = 'header-one',
  H2 = 'header-two',
  H3 = 'header-three'
}

export enum INLINE_STYLE_TYPES {
  BOLD = 'BOLD',
  ITALIC = 'ITALIC',
  STRIKETHROUGH = 'STRIKETHROUGH',
  CODE = 'CODE'
}

export enum BLOCK_TYPES {
  UL = 'unordered-list-item',
  OL = 'ordered-list-item',
  BLOCKQUOTE = 'blockquote'
}

export enum LIST_STYLE_TYPE_OPTIONS {
  NONE = 'none',
  DISC = 'disc',
  CIRCLE = 'circle',
  SQUARE = 'square',
  LOWER_LATIN = 'lower-latin',
  UPPER_LATIN = 'upper-latin',
  LOWER_ROMAN = 'lower-roman',
  UPPER_ROMAN = 'upper-roman',
  LOWER_GREEK = 'lower-greek',
  DECIMAL = 'decimal'
}

export enum FONT_WEIGHT_OPTIONS {
  FOUR_HUNDRED = '400',
  SEVEN_HUNDRED = '700'
}

export enum TEXT_ALIGN_TYPES {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right'
}

export enum MD_COMPONENT_PROPS {
  LIST_STYLE_TYPE = 'listStyleType',
  COLOR = 'color',
  FONT_FAMILY = 'fontFamily',
  FONT_SIZE = 'fontSize',
  FONT_WEIGHT = 'fontWeight',
  TEXT_ALIGN = 'textAlign',
  MARGIN = 'margin',
  MARGIN_HORIZONTAL = 'marginX',
  MARGIN_VERTICAL = 'marginY'
}

// Selected fonts from https://www.typewolf.com/google-fonts
export enum FONT_FAMILY_OPTIONS {
  INTER = 'Inter',
  DM_SANS = 'DM Sans',
  SPACE_MONO = 'Space Mono',
  SPACE_GROTESK = 'Space Grotesk',
  WORK_SANS = 'Work Sans',
  SYNE = 'Syne',
  LIBRE_FRANKLIN = 'Libre Franklin',
  CORMORANT = 'Cormorant',
  FIRA_SANS = 'Fira Sans',
  ECZAR = 'Eczar',
  ALEGREYA_SANS = 'Alegreya Sans',
  ALEGREYA = 'Alegreya',
  SOURCE_SANS_PRO = 'Source Sans Pro',
  SOURCE_SERIF_PRO = 'Source Serif Pro',
  ROBOTO = 'Roboto',
  ROBOTO_SLAB = 'Roboto Slab',
  BIO_RHYME = 'BioRhyme',
  INKNUT_ANTIQUA = 'Inknut Antiqua',
  POPPINS = 'Poppins',
  ARCHIVO_NARROW = 'Archivo Narrow',
  LIBRE_BASKERVILLE = 'Libre Baskerville',
  PLAYFAIR_DISPLAY = 'Playfair Display',
  KARLA = 'Karla',
  LORA = 'Lora',
  PROZA_LIBRE = 'Proza Libre',
  SPECTRAL = 'Spectral',
  IBM_PLEX_SANS = 'IBM Plex Sans',
  CRIMSON_PRO = 'Crimson Pro',
  MONTSERRAT = 'Montserrat',
  LATO = 'Lato',
  PT_SANS = 'PT Sans',
  PT_SERIF = 'PT Serif',
  CARDO = 'Cardo',
  CHIVO = 'Chivo',
  NEUTON = 'Neuton',
  RUBIK = 'Rubik',
  OPEN_SANS = 'Open Sans',
  INCONSOLATA = 'Inconsolata',
  RALEWAY = 'Raleway',
  MERRIWEATHER = 'Merriweather'
}

export const FONT_WEIGHTS = {
  '100': 'Thin',
  '200': 'Extra-light',
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'Semi-bold',
  '700': 'Bold',
  '800': 'Extra-bold',
  '900': 'Black'
};

export type FontWeight = keyof typeof FONT_WEIGHTS;

export const FONT_FAMILY_WEIGHTS: {
  [key in FONT_FAMILY_OPTIONS]: {
    weights: FontWeight[];
    italicWeights: FontWeight[];
  };
} = {
  [FONT_FAMILY_OPTIONS.INTER]: {
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.DM_SANS]: {
    weights: ['400', '500', '700'],
    italicWeights: ['400', '500', '700']
  },
  [FONT_FAMILY_OPTIONS.SPACE_MONO]: {
    weights: ['400', '700'],
    italicWeights: ['400', '700']
  },
  [FONT_FAMILY_OPTIONS.SPACE_GROTESK]: {
    weights: ['300', '400', '500', '600', '700'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.WORK_SANS]: {
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    italicWeights: [
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900'
    ]
  },
  [FONT_FAMILY_OPTIONS.SYNE]: {
    weights: ['400', '500', '600', '700', '800'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.LIBRE_FRANKLIN]: {
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    italicWeights: [
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900'
    ]
  },
  [FONT_FAMILY_OPTIONS.CORMORANT]: {
    weights: ['300', '400', '500', '600', '700'],
    italicWeights: ['300', '400', '500', '600', '700']
  },
  [FONT_FAMILY_OPTIONS.FIRA_SANS]: {
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    italicWeights: [
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900'
    ]
  },
  [FONT_FAMILY_OPTIONS.ECZAR]: {
    weights: ['400', '500', '600', '700', '800'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.ALEGREYA_SANS]: {
    weights: ['100', '300', '400', '500', '700', '800', '900'],
    italicWeights: ['100', '300', '400', '500', '700', '800', '900']
  },
  [FONT_FAMILY_OPTIONS.ALEGREYA]: {
    weights: ['400', '500', '600', '700', '800', '900'],
    italicWeights: ['400', '500', '600', '700', '800', '900']
  },
  [FONT_FAMILY_OPTIONS.SOURCE_SANS_PRO]: {
    weights: ['200', '300', '400', '600', '700', '900'],
    italicWeights: ['200', '300', '400', '600', '700', '900']
  },
  [FONT_FAMILY_OPTIONS.SOURCE_SERIF_PRO]: {
    weights: ['200', '300', '400', '600', '700', '900'],
    italicWeights: ['200', '300', '400', '600', '700', '900']
  },
  [FONT_FAMILY_OPTIONS.ROBOTO]: {
    weights: ['100', '300', '400', '500', '700', '800', '900'],
    italicWeights: ['100', '300', '400', '500', '700', '800', '900']
  },
  [FONT_FAMILY_OPTIONS.ROBOTO_SLAB]: {
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.BIO_RHYME]: {
    weights: ['200', '300', '400', '700', '800'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.INKNUT_ANTIQUA]: {
    weights: ['300', '400', '500', '600', '700', '800', '900'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.POPPINS]: {
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    italicWeights: [
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900'
    ]
  },
  [FONT_FAMILY_OPTIONS.ARCHIVO_NARROW]: {
    weights: ['400', '500', '600', '700'],
    italicWeights: ['400', '500', '600', '700']
  },
  [FONT_FAMILY_OPTIONS.LIBRE_BASKERVILLE]: {
    weights: ['400', '700'],
    italicWeights: ['400']
  },
  [FONT_FAMILY_OPTIONS.PLAYFAIR_DISPLAY]: {
    weights: ['400', '500', '600', '700', '800', '900'],
    italicWeights: ['400', '500', '600', '700', '800', '900']
  },
  [FONT_FAMILY_OPTIONS.KARLA]: {
    weights: ['200', '300', '400', '500', '600', '700', '800'],
    italicWeights: ['200', '300', '400', '500', '600', '700', '800']
  },
  [FONT_FAMILY_OPTIONS.LORA]: {
    weights: ['400', '500', '600', '700'],
    italicWeights: ['400', '500', '600', '700']
  },
  [FONT_FAMILY_OPTIONS.PROZA_LIBRE]: {
    weights: ['400', '500', '600', '700', '800'],
    italicWeights: ['400', '500', '600', '700', '800']
  },
  [FONT_FAMILY_OPTIONS.SPECTRAL]: {
    weights: ['200', '300', '400', '500', '600', '700', '800'],
    italicWeights: ['200', '300', '400', '500', '600', '700', '800']
  },
  [FONT_FAMILY_OPTIONS.IBM_PLEX_SANS]: {
    weights: ['100', '200', '300', '400', '500', '600', '700'],
    italicWeights: ['100', '200', '300', '400', '500', '600', '700']
  },
  [FONT_FAMILY_OPTIONS.CRIMSON_PRO]: {
    weights: ['200', '300', '400', '500', '600', '700', '800', '900'],
    italicWeights: ['200', '300', '400', '500', '600', '700', '800', '900']
  },
  [FONT_FAMILY_OPTIONS.MONTSERRAT]: {
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    italicWeights: [
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900'
    ]
  },
  [FONT_FAMILY_OPTIONS.LATO]: {
    weights: ['100', '300', '400', '700', '900'],
    italicWeights: ['100', '300', '400', '700', '900']
  },
  [FONT_FAMILY_OPTIONS.PT_SANS]: {
    weights: ['400', '700'],
    italicWeights: ['400', '700']
  },
  [FONT_FAMILY_OPTIONS.PT_SERIF]: {
    weights: ['400', '700'],
    italicWeights: ['400', '700']
  },
  [FONT_FAMILY_OPTIONS.CARDO]: {
    weights: ['400', '700'],
    italicWeights: ['400']
  },
  [FONT_FAMILY_OPTIONS.CHIVO]: {
    weights: ['300', '400', '700', '900'],
    italicWeights: ['300', '400', '700', '900']
  },
  [FONT_FAMILY_OPTIONS.NEUTON]: {
    weights: ['200', '300', '400', '700', '800'],
    italicWeights: ['400']
  },
  [FONT_FAMILY_OPTIONS.RUBIK]: {
    weights: ['300', '400', '500', '600', '700', '800', '900'],
    italicWeights: ['300', '400', '500', '600', '700', '800', '900']
  },
  [FONT_FAMILY_OPTIONS.OPEN_SANS]: {
    weights: ['300', '400', '600', '700', '800'],
    italicWeights: ['300', '400', '600', '700', '800']
  },
  [FONT_FAMILY_OPTIONS.INCONSOLATA]: {
    weights: ['200', '300', '400', '500', '600', '700', '800', '900'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.RALEWAY]: {
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    italicWeights: [
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900'
    ]
  },
  [FONT_FAMILY_OPTIONS.MERRIWEATHER]: {
    weights: ['300', '400', '700', '900'],
    italicWeights: ['300', '400', '700', '900']
  }
};

export const HEADING_OPTIONS = {
  [HEADING_TYPES.H1]: {
    tooltip: 'Heading 1',
    icon: HeaderOneIcon
  },
  [HEADING_TYPES.H2]: {
    tooltip: 'Heading 2',
    icon: HeaderTwoIcon
  },
  [HEADING_TYPES.H3]: {
    tooltip: 'Heading 3',
    icon: HeaderThreeIcon
  }
};

export const INLINE_STYLE_OPTIONS = {
  [INLINE_STYLE_TYPES.BOLD]: {
    tooltip: 'Bold ⌘B',
    icon: BoldIcon
  },
  [INLINE_STYLE_TYPES.ITALIC]: {
    tooltip: 'Italic ⌘I',
    icon: ItalicIcon
  },
  [INLINE_STYLE_TYPES.STRIKETHROUGH]: {
    tooltip: 'Strikethrough',
    icon: StrikethroughIcon
  },
  [INLINE_STYLE_TYPES.CODE]: {
    tooltip: 'Code ⌘J',
    icon: CodeIcon
  }
};

export const BLOCK_OPTIONS = {
  [BLOCK_TYPES.UL]: {
    tooltip: 'Unordered List',
    icon: PropertiesIcon
  },
  [BLOCK_TYPES.OL]: {
    tooltip: 'Ordered List',
    icon: NumberedListIcon
  },
  [BLOCK_TYPES.BLOCKQUOTE]: {
    tooltip: 'Blockquote',
    icon: CitationIcon
  }
};

export const TEXT_ALIGN_OPTIONS = {
  [TEXT_ALIGN_TYPES.LEFT]: {
    tooltip: 'Align Left',
    icon: AlignLeftIcon
  },
  [TEXT_ALIGN_TYPES.CENTER]: {
    tooltip: 'Align Center',
    icon: AlignCenterIcon
  },
  [TEXT_ALIGN_TYPES.RIGHT]: {
    tooltip: 'Align Right',
    icon: AlignRightIcon
  }
};
