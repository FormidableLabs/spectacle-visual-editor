import { defaultTheme, Theme } from 'evergreen-ui';

/*
  Override theme tokens and component styles globally
  For more information, see: https://evergreen.segment.com/introduction/theming
*/

const WHITE = '#FFF';

export const theme: Theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    white: WHITE
  },
  components: {
    ...defaultTheme.components,
    Button: {
      ...defaultTheme.components.Button,
      appearances: {
        ...defaultTheme.components.Button.appearances,
        default: {
          ...defaultTheme.components.Button.appearances.default,
          _active: {
            color: defaultTheme.colors.selected,
            backgroundColor: defaultTheme.colors.blueTint
          }
        },
        minimal: {
          ...defaultTheme.components.Button.appearances.minimal,
          _active: {
            color: defaultTheme.colors.selected,
            backgroundColor: defaultTheme.colors.blueTint,
            '& svg': {
              fill: defaultTheme.colors.selected
            }
          }
        }
      }
    },
    Input: {
      ...defaultTheme.components.Input,
      appearances: {
        ...defaultTheme.components.Input.appearances,
        default: {
          ...defaultTheme.components.Input.appearances.default,
          paddingX: 6,
          backgroundColor: WHITE,
          borderColor: defaultTheme.colors.gray500,
          _disabled: {
            backgroundColor: defaultTheme.colors.gray200
          }
        }
      }
    },
    Select: {
      ...defaultTheme.components.Select,
      baseStyle: {
        ...defaultTheme.components.Select.baseStyle,
        backgroundColor: WHITE
      },
      appearances: {
        ...defaultTheme.components.Select.appearances,
        default: {
          ...defaultTheme.components.Select.appearances.default,
          paddingLeft: 6,
          backgroundColor: `${WHITE} !important`, // Override backgroundColor: "none";
          _disabled: {
            backgroundColor: defaultTheme.colors.gray200
          }
        }
      }
    }
  }
};
