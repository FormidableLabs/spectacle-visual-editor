import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pane } from './inspector-styles';
import { TextInputField } from 'evergreen-ui';
import { deckSlice, themeSelector } from '../../slices/deck-slice';
import { isValidCSSColor } from '../../util/is-valid-css-color';

export const DocumentInspector = () => {
  const dispatch = useDispatch();
  const theme = useSelector(themeSelector);
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [tertiaryColor, setTertiaryColor] = useState('');

  useEffect(() => {
    setPrimaryColor(theme?.colors?.primary || '');
    setSecondaryColor(theme?.colors?.secondary || '');
    setTertiaryColor(theme?.colors?.tertiary || '');
  }, [theme]);

  return (
    <Pane>
      <TextInputField
        label="Primary Theme Value"
        inputHeight={24}
        value={primaryColor}
        onChange={(e) => {
          setPrimaryColor(e.target.value);
          if (!isValidCSSColor(e.target.value)) {
            return;
          }
          dispatch(
            deckSlice.actions.updateThemeColors({ primary: e.target.value })
          );
        }}
      />
      <TextInputField
        label="Secondary Theme Value"
        inputHeight={24}
        value={secondaryColor}
        onChange={(e) => {
          setSecondaryColor(e.target.value);
          if (!isValidCSSColor(e.target.value)) {
            return;
          }
          dispatch(
            deckSlice.actions.updateThemeColors({ secondary: e.target.value })
          );
        }}
      />
      <TextInputField
        label="Tertiary Theme Value"
        inputHeight={24}
        value={tertiaryColor}
        onChange={(e) => {
          setTertiaryColor(e.target.value);
          if (!isValidCSSColor(e.target.value)) {
            return;
          }
          dispatch(
            deckSlice.actions.updateThemeColors({ tertiary: e.target.value })
          );
        }}
      />
    </Pane>
  );
};
