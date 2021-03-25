import React, { ChangeEvent, FocusEvent } from 'react';
import styled from 'styled-components';
import { TextInputField } from 'evergreen-ui';
import { isValidCSSColor } from '../../util/is-valid-css-color';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  div {
    flex: 1;
  }
`;

const ColorSwatch = styled.span`
  display: inline-block;
  border: 1px solid hsla(0, 0%, 0%, 0.5);
  border-radius: 20px;
  margin-left: 8px;
  box-shadow: inset 0 0 0 1px white;
  background: ${({ color }) => color};
  width: 20px;
  height: 20px;
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
  disabled,
  onChangeInput,
  value,
  onUpdateValue,
  validValue
}) => {
  return (
    <Container>
      <TextInputField
        inputHeight={24}
        label={label}
        value={value}
        disabled={disabled}
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
  );
};
