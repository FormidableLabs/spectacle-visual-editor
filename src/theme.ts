import { defaultTheme } from 'evergreen-ui';

export const theme = {
  ...defaultTheme,
  components: {
    ...defaultTheme.components,
    Button: {
      ...defaultTheme.components.Button,
      baseStyle: {
        ...defaultTheme.components.Button.baseStyle,
        _active: {
          color: defaultTheme.colors.selected,
          'background-color': `${defaultTheme.colors.blueTint} !important`
        }
      }
    },
    Input: {
      ...defaultTheme.components.Input,
      baseStyle: {
        ...defaultTheme.components.Input.baseStyle
        // height: 24,
        // paddingX: 6
      }
    }
  }
};
