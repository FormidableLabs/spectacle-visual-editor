import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pane } from './inspector-styles';
import { deckSlice, themeSelector } from '../../slices/deck-slice';
import { ColorPickerInput } from '../inputs/color';

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
      <ColorPickerInput
        onChangeInput={setPrimaryColor}
        label="Primary Theme Value"
        onUpdateValue={(value) =>
          dispatch(deckSlice.actions.updateThemeColors({ primary: value }))
        }
        validValue={theme?.colors?.primary}
        value={primaryColor}
      />
      <ColorPickerInput
        onChangeInput={setSecondaryColor}
        label="Secondary Theme Value"
        onUpdateValue={(value) =>
          dispatch(deckSlice.actions.updateThemeColors({ secondary: value }))
        }
        validValue={theme?.colors?.secondary}
        value={secondaryColor}
      />
      <ColorPickerInput
        onChangeInput={setTertiaryColor}
        label="Tertiary Theme Value"
        onUpdateValue={(value) =>
          dispatch(deckSlice.actions.updateThemeColors({ tertiary: value }))
        }
        validValue={theme?.colors?.tertiary}
        value={tertiaryColor}
      />
    </Pane>
  );
};
