import { defaultTheme } from 'evergreen-ui';

const WHITE = '#FFF';

export const theme = {
  ...defaultTheme,
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
