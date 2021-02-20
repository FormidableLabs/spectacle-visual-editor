import React, { useEffect, useState } from 'react';
import { Pane } from './inspector-styles';
import { TextInputField } from 'evergreen-ui';
import { useDispatch, useSelector } from 'react-redux';
import { deckSlice, selectedElementSelector } from '../slices/deck-slice';
import { isValidColorName, isValidHSL, isValidRGB } from 'is-valid-css-color';

const isValidCSSColor = (color) =>
  isValidColorName(color) || isValidHSL(color) || isValidRGB(color);

export const FormatInspector = () => {
  const dispatch = useDispatch();
  const [backgroundColor, setBackgroundColor] = useState('');
  const selectedElement = useSelector(selectedElementSelector);

  useEffect(() => {
    const selectedBackgroundColor = selectedElement?.props?.backgroundColor;
    setBackgroundColor(selectedBackgroundColor || '');
  }, [selectedElement]);

  return (
    <Pane>
      <TextInputField
        label="Background Color"
        inputHeight={24}
        disabled={!selectedElement?.props?.backgroundColor}
        value={backgroundColor}
        onChange={(e) => {
          setBackgroundColor(e.target.value);
          if (!isValidCSSColor(e.target.value)) {
            return;
          }
          dispatch(
            deckSlice.actions.editableElementChanged({
              backgroundColor: e.target.value
            })
          );
        }}
      />
    </Pane>
  );
};
