import { FormField, Switch, TextInputField } from 'evergreen-ui';
import React, { ChangeEvent, FocusEvent, useCallback, useState } from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';
import { isValidCSSSize } from '../../util/is-valid-css-size';
import { ElementControlsProps } from './element-controls-props';

export const FreeMovementControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const [displayState, setDisplayState] = useState({
    isFreeMovement: selectedElement?.props?.componentProps?.isFreeMovement,
    positionX: selectedElement?.props?.componentProps?.positionX || 0,
    positionY: selectedElement?.props?.componentProps?.positionY || 0
  });

  const [inputState, setInputState] = useState({
    freeMovement: displayState.isFreeMovement,
    positionX: displayState.positionX,
    positionY: displayState.positionY
  });

  const [freeMovement, toggleFreeMovement] = useToggle(
    displayState.isFreeMovement
  );

  const handleComponentElementChanged = useCallback(
    (propName: string, val: string | number | boolean) => {
      if (selectedElement) {
        editableElementChanged({
          componentProps: {
            ...selectedElement.props?.componentProps,
            [propName]: val
          }
        });
      }
    },
    [editableElementChanged, selectedElement]
  );

  const handleDefaultElementChanged = useCallback(
    (propName: string, val: string | number) => {
      if (selectedElement) {
        editableElementChanged({
          [propName]: val
        });
      }
    },
    [editableElementChanged, selectedElement]
  );

  const handleOnEvent = useCallback(
    (options: {
      value: string | number;
      shouldSetInputState: boolean;
      valueToChangeName: string;
      valueToChangeCSSName: string;
      valueAsCSSValue: string;
      validator: Function;
    }) => {
      if (options.shouldSetInputState) {
        setInputState({
          ...inputState,
          [options.valueToChangeName]:
            displayState[options.valueToChangeName as keyof typeof displayState]
        });
      }
      if (options.validator(options.value)) {
        if (options.shouldSetInputState) {
          setDisplayState({
            ...displayState,
            [options.valueToChangeName]: options.value
          });
          setInputState({
            ...inputState,
            [options.valueToChangeName]: options.value
          });
        }
        handleComponentElementChanged(options.valueToChangeName, options.value);
        handleDefaultElementChanged(
          options.valueToChangeCSSName,
          options.valueAsCSSValue
        );
      }
    },
    [
      handleComponentElementChanged,
      handleDefaultElementChanged,
      inputState,
      displayState
    ]
  );

  const onToggle = () => {
    if (!freeMovement) {
      handleOnEvent({
        value: 'absolute',
        shouldSetInputState: false,
        valueToChangeName: 'position',
        valueToChangeCSSName: 'position',
        valueAsCSSValue: 'absolute',
        validator: () => {
          return true;
        }
      });
    } else {
      // clear freeMovement. Set horizontal & vertical positions to last input values
      editableElementChanged({
        componentProps: {
          ...selectedElement?.props?.componentProps,
          positionX: inputState.positionX,
          positionY: inputState.positionY
        }
      });

      handleOnEvent({
        value: 'static',
        shouldSetInputState: false,
        valueToChangeName: 'position',
        valueToChangeCSSName: 'position',
        valueAsCSSValue: 'static',
        validator: () => {
          return true;
        }
      });
    }
    handleComponentElementChanged('isFreeMovement', !freeMovement);
  };

  return (
    <>
      <Container label="Free Movement">
        <SwitchContainer label="Free-moving position element">
          <Switch
            checked={freeMovement}
            onChange={() => {
              toggleFreeMovement();
              onToggle();
            }}
          />
        </SwitchContainer>

        {!freeMovement ? (
          <></>
        ) : (
          <>
            <TextInputField
              label="X-Coordinate"
              value={inputState.positionX}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                const { value } = e.target;
                handleOnEvent({
                  value: value,
                  shouldSetInputState: true,
                  valueToChangeName: 'positionX',
                  valueToChangeCSSName: 'left',
                  valueAsCSSValue: value,
                  validator: isValidCSSSize
                });
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;
                setInputState({ ...inputState, positionX: value });
                handleOnEvent({
                  value,
                  shouldSetInputState: false,
                  valueToChangeName: 'positionX',
                  valueToChangeCSSName: 'left',
                  valueAsCSSValue: value,
                  validator: isValidCSSSize
                });
              }}
            />
            <TextInputField
              label="Y-Coordinate"
              value={inputState.positionY}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                const { value } = e.target;
                handleOnEvent({
                  value: value,
                  shouldSetInputState: true,
                  valueToChangeName: 'positionY',
                  valueToChangeCSSName: 'top',
                  valueAsCSSValue: value,
                  validator: isValidCSSSize
                });
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;
                setInputState({ ...inputState, positionY: value });
                handleOnEvent({
                  value,
                  shouldSetInputState: false,
                  valueToChangeName: 'positionY',
                  valueToChangeCSSName: 'top',
                  valueAsCSSValue: value,
                  validator: isValidCSSSize
                });
              }}
            />
          </>
        )}
      </Container>
    </>
  );
};

const Container = styled(FormField)`
  display: grid;
  margin-top: 10px;
  > div {
    margin-bottom: 12px;
    label {
      font-weight: 400;
    }
  }
`;

const SwitchContainer = styled(FormField)`
  display: flex;
  flex-direction: row;
  align-items: center;
  > label {
    margin-right: 10px;
  }
`;
