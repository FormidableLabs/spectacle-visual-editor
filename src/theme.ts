import { defaultTheme } from 'evergreen-ui';

/*
  Override theme tokens and component styles globally
  For more information, see: https://evergreen.segment.com/introduction/theming
*/

const WHITE = '#FFF';

export const theme = {
  colors: {
    white: WHITE
  },
  components: {
    Button: {
      appearances: {
        default: {
          _active: {
            color: defaultTheme.colors.selected,
            backgroundColor: defaultTheme.colors.blueTint
          }
        },
        minimal: {
          _active: {
            color: defaultTheme.colors.selected,
            backgroundColor: defaultTheme.colors.blueTint
          }
        }
      }
    },
    Input: {
      appearances: {
        default: {
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
      baseStyle: {
        backgroundColor: WHITE
      },
      appearances: {
        default: {
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
