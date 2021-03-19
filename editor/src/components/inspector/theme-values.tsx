import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { deckSlice, themeSelector } from '../../slices/deck-slice';
import { ColorPickerInput } from '../inputs/color';
import { useRootSelector } from '../../store';

const Container = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 10px;
  width: calc(100% - 10px);
`;

export const ThemeValues = () => {
  const dispatch = useDispatch();
  const themeValues = useRootSelector(themeSelector);
  const [inputState, setInputState] = useState(themeValues);

  return (
    <Container>
      {'colors' in themeValues &&
        Object.keys(themeValues.colors).map((colorKey) => (
          <ColorPickerInput
            onChangeInput={(value) =>
              setInputState((prevState) => {
                return {
                  ...prevState,
                  colors: { ...prevState.colors, [colorKey]: value }
                };
              })
            }
            key={`${colorKey}-color-value`}
            label={
              colorKey[0].toUpperCase() + colorKey.slice(1, colorKey.length)
            }
            onUpdateValue={(value) =>
              dispatch(
                deckSlice.actions.updateThemeColors({ [colorKey]: value })
              )
            }
            validValue={themeValues?.colors[colorKey]}
            value={inputState.colors[colorKey]}
          />
        ))}
    </Container>
  );
};
