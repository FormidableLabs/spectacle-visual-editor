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

export enum LIST_TEXT_ALIGN_OPTIONS {
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

// Selected fonts from https://typewise.xyz/
export enum FONT_FAMILY_OPTIONS {
  ROBOTO = 'Roboto',
  ROBOTO_SLAB = 'Roboto Slab',
  WORK_SANS = 'Work Sans',
  OPEN_SANS = 'Open Sans',
  PLAYFAIR_DISPLAY = 'Playfair Display',
  MONTSERRAT = 'Montserrat',
  RALEWAY = 'Raleway',
  ALEGREYA = 'Alegreya',
  MERRIWEATHER = 'Merriweather',
  ROBOTO_MONO = 'Roboto Mono',
  SPACE_MONO = 'Space Mono',
  RUFINA = 'Rufina',
  QUATTROCENTO = 'Quattrocento',
  LATO = 'Lato',
  SOURCE_SANS_PRO = 'Source Sans Pro',
  SOURCE_SERIF_PRO = 'Source Serif Pro',
  POPPINS = 'Poppins',
  LOBSTER = 'Lobster',
  PATUA_ONE = 'Patua One',
  ABRIL_FATFACE = 'Abril Fatface',
  ROZHA_ONE = 'Rozha One',
  ULTRA = 'Ultra',
  ARCHIVO_NARROW = 'Archivo Narrow',
  OSWALD = 'Oswald',
  ZILLA_SLAB = 'Zilla Slab',
  OVERPASS = 'Overpass',
  JOSEFIN_SANS = 'Josefin Sans',
  OLD_STANDARD_TT = 'Old Standard TT',
  GENTIUM_BASIC = 'Gentium Basic',
  VARELA_ROUND = 'Varela Round',
  RAJDHANI = 'Rajdhani',
  NUNITO_SANS = 'Nunito Sans',
  NEUTON = 'Neuton',
  CABIN = 'Cabin',
  NOTO_SERIF = 'Noto Serif',
  LIBRE_FRANKLIN = 'Libre Franklin',
  RUBIK = 'Rubik',
  COMFORTAA = 'Comfortaa',
  PT_SANS = 'PT Sans',
  PT_SERIF = 'PT Serif',
  ANONYMOUS_PRO = 'Anonymous Pro',
  INCONSOLATA = 'Inconsolata',
  BITTER = 'Bitter',
  DOMINE = 'Domine',
  SPECTRAL = 'Spectral',
  KARLA = 'Karla'
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

type Weight = keyof typeof FONT_WEIGHTS;

type FontFamilyWeights = {
  [key in FONT_FAMILY_OPTIONS]: {
    weights: Weight[];
    italicWeights: Weight[];
  };
};

export const FONT_FAMILY_WEIGHTS: FontFamilyWeights = {
  [FONT_FAMILY_OPTIONS.ROBOTO]: {
    weights: ['100', '300', '400', '500', '700', '800', '900'],
    italicWeights: ['100', '300', '400', '500', '700', '800', '900']
  },
  [FONT_FAMILY_OPTIONS.ROBOTO_SLAB]: {
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
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
  [FONT_FAMILY_OPTIONS.OPEN_SANS]: {
    weights: ['300', '400', '600', '700', '800'],
    italicWeights: ['300', '400', '600', '700', '800']
  },
  [FONT_FAMILY_OPTIONS.PLAYFAIR_DISPLAY]: {
    weights: ['400', '500', '600', '700', '800', '900'],
    italicWeights: ['400', '500', '600', '700', '800', '900']
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
  [FONT_FAMILY_OPTIONS.ALEGREYA]: {
    weights: ['400', '500', '600', '700', '800', '900'],
    italicWeights: ['400', '500', '600', '700', '800', '900']
  },
  [FONT_FAMILY_OPTIONS.MERRIWEATHER]: {
    weights: ['300', '400', '700', '900'],
    italicWeights: ['300', '400', '700', '900']
  },
  [FONT_FAMILY_OPTIONS.ROBOTO_MONO]: {
    weights: ['100', '200', '300', '400', '500', '600', '700'],
    italicWeights: ['100', '200', '300', '400', '500', '600', '700']
  },
  [FONT_FAMILY_OPTIONS.SPACE_MONO]: {
    weights: ['400', '700'],
    italicWeights: ['400', '700']
  },
  [FONT_FAMILY_OPTIONS.RUFINA]: {
    weights: ['400', '700'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.QUATTROCENTO]: {
    weights: ['400', '700'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.LATO]: {
    weights: ['100', '300', '400', '700', '900'],
    italicWeights: ['100', '300', '400', '700', '900']
  },
  [FONT_FAMILY_OPTIONS.SOURCE_SANS_PRO]: {
    weights: ['200', '300', '400', '600', '700', '900'],
    italicWeights: ['200', '300', '400', '600', '700', '900']
  },
  [FONT_FAMILY_OPTIONS.SOURCE_SERIF_PRO]: {
    weights: ['200', '300', '400', '600', '700', '900'],
    italicWeights: ['200', '300', '400', '600', '700', '900']
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
  [FONT_FAMILY_OPTIONS.LOBSTER]: {
    weights: ['400'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.PATUA_ONE]: {
    weights: ['400'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.ABRIL_FATFACE]: {
    weights: ['400'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.ROZHA_ONE]: {
    weights: ['400'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.ULTRA]: {
    weights: ['400'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.ARCHIVO_NARROW]: {
    weights: ['400', '500', '600', '700'],
    italicWeights: ['400', '500', '600', '700']
  },
  [FONT_FAMILY_OPTIONS.OSWALD]: {
    weights: ['200', '300', '400', '500', '600', '700'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.ZILLA_SLAB]: {
    weights: ['300', '400', '500', '600', '700'],
    italicWeights: ['300', '400', '500', '600', '700']
  },
  [FONT_FAMILY_OPTIONS.OVERPASS]: {
    weights: ['100', '200', '300', '400', '600', '700', '800', '900'],
    italicWeights: ['100', '200', '300', '400', '600', '700', '800', '900']
  },
  [FONT_FAMILY_OPTIONS.JOSEFIN_SANS]: {
    weights: ['100', '200', '300', '400', '500', '600', '700'],
    italicWeights: ['100', '200', '300', '400', '500', '600', '700']
  },
  [FONT_FAMILY_OPTIONS.OLD_STANDARD_TT]: {
    weights: ['400', '700'],
    italicWeights: ['400']
  },
  [FONT_FAMILY_OPTIONS.GENTIUM_BASIC]: {
    weights: ['400', '700'],
    italicWeights: ['400', '700']
  },
  [FONT_FAMILY_OPTIONS.VARELA_ROUND]: {
    weights: ['400'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.RAJDHANI]: {
    weights: ['300', '400', '500', '600', '700'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.NUNITO_SANS]: {
    weights: ['200', '300', '400', '600', '700', '800', '900'],
    italicWeights: ['200', '300', '400', '600', '700', '800', '900']
  },
  [FONT_FAMILY_OPTIONS.NEUTON]: {
    weights: ['200', '300', '400', '700', '800'],
    italicWeights: ['400']
  },
  [FONT_FAMILY_OPTIONS.CABIN]: {
    weights: ['400', '500', '600', '700'],
    italicWeights: ['400', '500', '600', '700']
  },
  [FONT_FAMILY_OPTIONS.NOTO_SERIF]: {
    weights: ['400', '700'],
    italicWeights: ['400', '700']
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
  [FONT_FAMILY_OPTIONS.RUBIK]: {
    weights: ['300', '400', '500', '600', '700', '800', '900'],
    italicWeights: ['300', '400', '500', '600', '700', '800', '900']
  },
  [FONT_FAMILY_OPTIONS.COMFORTAA]: {
    weights: ['300', '400', '500', '600', '700'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.PT_SANS]: {
    weights: ['400', '700'],
    italicWeights: ['400', '700']
  },
  [FONT_FAMILY_OPTIONS.PT_SERIF]: {
    weights: ['400', '700'],
    italicWeights: ['400', '700']
  },
  [FONT_FAMILY_OPTIONS.ANONYMOUS_PRO]: {
    weights: ['400', '700'],
    italicWeights: ['400', '700']
  },
  [FONT_FAMILY_OPTIONS.INCONSOLATA]: {
    weights: ['200', '300', '400', '500', '600', '700', '800', '900'],
    italicWeights: []
  },
  [FONT_FAMILY_OPTIONS.BITTER]: {
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
  [FONT_FAMILY_OPTIONS.DOMINE]: {
    weights: ['400', '500', '600', '700'],
    italicWeights: ['400', '500', '600', '700']
  },
  [FONT_FAMILY_OPTIONS.SPECTRAL]: {
    weights: ['200', '300', '400', '500', '600', '700', '800'],
    italicWeights: ['200', '300', '400', '500', '600', '700', '800']
  },
  [FONT_FAMILY_OPTIONS.KARLA]: {
    weights: ['200', '300', '400', '500', '600', '700', '800'],
    italicWeights: ['200', '300', '400', '500', '600', '700', '800']
  }
};
