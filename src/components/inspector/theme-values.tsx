import React, { ChangeEvent, FocusEvent, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { capitalize } from 'lodash-es';
import { deckSlice, themeSelector } from '../../slices/deck-slice';
import { ColorPickerInput } from '../inputs/color';
import { useRootSelector } from '../../store';
import { Accordion } from '../user-interface/accordion';
import {
  Pane,
  Button,
  LockIcon,
  UnlockIcon,
  TextInputField
} from 'evergreen-ui';
import { isValidCSSSize } from '../../util/is-valid-css-size';
import { isValidSlideSize } from '../../util/is-valid-slide-size';
import { cloneAndSet } from '../../util/clone-and-set';
import { calculateAspectRatio } from '../../util/aspect-ratio';
import { useToggle } from '../../hooks/index';

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
  const [aspectRatioLocked, toggleAspectRatioLocked] = useToggle();

  return (
    <>
      <Accordion label="Theme Slide Dimensions">
        <Container>
          {['width', 'height'].map((sizeKey) => (
            <TextInputField
              key={`${sizeKey}-font-size-value`}
              type="number"
              inputHeight={24}
              label={capitalize(sizeKey)}
              value={inputState.size[sizeKey]}
              disabled={false}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                const value = e.target.value;
                if (isValidSlideSize(value)) {
                  setInputState((prevState) =>
                    cloneAndSet(prevState, ['size', sizeKey], value)
                  );
                }
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                setInputState((prevState) =>
                  cloneAndSet(prevState, ['size', sizeKey], value)
                );
                if (!isValidSlideSize(value)) {
                  return;
                }
                if (aspectRatioLocked) {
                  const width = themeValues.size.width;
                  const height = themeValues.size.height;
                  const newSize = calculateAspectRatio(
                    { width, height },
                    { [sizeKey]: parseInt(value) }
                  );
                  setInputState((prevState) =>
                    cloneAndSet(prevState, ['size', 'height'], newSize.height)
                  );
                  setInputState((prevState) =>
                    cloneAndSet(prevState, ['size', 'width'], newSize.width)
                  );
                  dispatch(deckSlice.actions.updateThemeSize(newSize));
                } else {
                  dispatch(
                    deckSlice.actions.updateThemeSize({
                      [sizeKey]: parseInt(value)
                    })
                  );
                }
              }}
            />
          ))}
        </Container>
        <Pane>
          <Button
            marginY={8}
            marginRight={12}
            iconBefore={aspectRatioLocked ? LockIcon : UnlockIcon}
            onClick={toggleAspectRatioLocked}
          >
            Lock Aspect Ratio
          </Button>
        </Pane>
      </Accordion>
      <Accordion label="Theme Colors">
        <Container>
          {'colors' in themeValues &&
            Object.keys(themeValues.colors).map((colorKey) => (
              <ColorPickerInput
                onChangeInput={(value) =>
                  setInputState((prevState) =>
                    cloneAndSet(prevState, ['colors', colorKey], value)
                  )
                }
                key={`${colorKey}-color-value`}
                label={capitalize(colorKey)}
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
      </Accordion>
      <Accordion label="Theme Font Sizes">
        <Container>
          {'fontSizes' in themeValues &&
            Object.keys(themeValues.fontSizes).map((fontSizeKey) => (
              <TextInputField
                key={`${fontSizeKey}-font-size-value`}
                inputHeight={24}
                label={capitalize(fontSizeKey)}
                value={inputState.fontSizes[fontSizeKey]}
                disabled={false}
                onBlur={(e: FocusEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (!isValidCSSSize(value)) {
                    setInputState((prevState) =>
                      cloneAndSet(prevState, ['fontSizes', fontSizeKey], value)
                    );
                  }
                }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  setInputState((prevState) =>
                    cloneAndSet(prevState, ['fontSizes', fontSizeKey], value)
                  );
                  if (!isValidCSSSize(value)) {
                    return;
                  }
                  dispatch(
                    deckSlice.actions.updateThemeFontSizes({
                      [fontSizeKey]: value
                    })
                  );
                }}
              />
            ))}
        </Container>
      </Accordion>
    </>
  );
};
