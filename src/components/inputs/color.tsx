import React, { ChangeEvent, FocusEvent, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Popover, Heading, TextInputField, Select } from 'evergreen-ui';
import { RgbaStringColorPicker } from 'react-colorful';
import namesPlugin from 'colord/plugins/names';
import { colord, extend } from 'colord';
import { isValidCSSColor } from '../../util/is-valid-css-color';
import { useRootSelector } from '../../store';
import { themeSelector } from '../../slices/deck-slice';
import { SWATCH_NAMES, DEFAULT_COLORS } from '../../constants/color-swatches';
import TransSVG from './transparentSVG';

extend([namesPlugin]); // convert CSS colors to RGBA strings

export const Container = styled.div<{ isDisabled: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 24px;
  ${(props) => props.isDisabled && 'pointer-events: none;'}

  div {
    flex: 1;
  }
`;

const ColorSwatch = styled.span`
  display: inline-block;
  border: 1px solid hsla(0, 0%, 0%, 0.5);
  border-radius: 24px;
  margin-left: 8px;
  margin-bottom: 3px;
  box-shadow: inset 0 0 0 1px white;
  background: ${({ color }) => color};
  width: 24px;
  height: 24px;
`;

export const PopoverContainer = styled.div`
  padding: 10px;

  .react-colorful__pointer {
    width: 14px;
    height: 14px;
    border-width: 1px;
  }

  .react-colorful__alpha-pointer,
  .react-colorful__hue-pointer {
    width: 10px;
    height: 25px;
    border-radius: 3px;
  }

  .react-colorful__saturation {
    border-radius: 3px 3px 0 0;
  }

  .react-colorful__last-control {
    border-radius: 0 0 3px 3px;
  }
`;

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: 4px;
  margin-top: 8px;
`;

const Swatch = styled.button`
  border-radius: 3px;
  background: ${({ color }) => color};
  border: 1px solid hsla(0, 0%, 0%, 0.5);
  box-shadow: inset 0 0 0 1px white;
  height: 22px;
  padding: 1px;
  cursor: pointer;
`;

interface Props {
  disabled?: boolean;
  label: string;
  /**
   * onChangeInput is when any text is updated inside the input field.
   * This is to ensure the controlled field is in sync, usually using a setState setter.
   */
  onChangeInput(value: string): void;
  /**
   * onUpdateValue is when any text is updated _and_ the value is valid.
   * This is to ensure no invalid values could break the slide or element props.
   */
  onUpdateValue(value: string): void;
  value?: string;
  /**
   * This is the last known valid color value used for the preview.
   */
  validValue: string;
}

export const ColorPickerInput: React.FC<Props> = ({
  label,
  disabled = false,
  onChangeInput,
  value,
  onUpdateValue,
  validValue
}) => {
  const theme = useRootSelector(themeSelector);

  const swatches = useMemo(
    () => ({
      [SWATCH_NAMES.THEME_COLORS]: Object.values(theme.colors),
      [SWATCH_NAMES.DEFAULT_COLORS]: DEFAULT_COLORS
    }),
    [theme.colors]
  );

  const [selectedSwatch, setSelectedSwatch] = useState(
    SWATCH_NAMES.THEME_COLORS
  );

  const setColor = (value: string) => {
    onChangeInput(value);
    onUpdateValue(value);
  };

  const rgbaColor = useMemo(
    () =>
      validValue?.startsWith('rgba')
        ? validValue
        : colord(validValue).toRgbString(),
    [validValue]
  );

  return (
    <Popover
      position="bottom-left"
      content={
        <PopoverContainer>
          <Heading is="p" size={200} marginBottom={4}>
            Color Picker
          </Heading>

          <RgbaStringColorPicker color={rgbaColor} onChange={setColor} />

          <Heading is="p" size={200} marginTop={12} marginBottom={4}>
            Swatches
          </Heading>

          <Select
            width="100%"
            value={selectedSwatch}
            onChange={(e) => setSelectedSwatch(e.target.value)}
          >
            {Object.keys(swatches).map((swatch) => (
              <option key={swatch} value={swatch}>
                {swatch}
              </option>
            ))}
          </Select>

          <SwatchGrid>
            {swatches[selectedSwatch].map((color, i) => (
              <Swatch
                key={`${selectedSwatch}-${color}-${i}`}
                color={color}
                onClick={() => setColor(color)}
              >
                {color === 'transparent' && <TransSVG />}
              </Swatch>
            ))}
          </SwatchGrid>
        </PopoverContainer>
      }
    >
      <Container isDisabled={disabled}>
        <TextInputField
          label={label}
          value={value}
          disabled={disabled}
          marginBottom={0}
          onBlur={(e: FocusEvent<HTMLInputElement>) => {
            const currentValue = e.target.value;
            if (!isValidCSSColor(currentValue)) {
              onChangeInput(validValue);
            }
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const updatedValue = e.target.value;
            onChangeInput(updatedValue);
            if (!isValidCSSColor(updatedValue)) {
              return;
            }
            onUpdateValue(updatedValue);
          }}
        />
        <ColorSwatch color={validValue || ''} />
      </Container>
    </Popover>
  );
};
