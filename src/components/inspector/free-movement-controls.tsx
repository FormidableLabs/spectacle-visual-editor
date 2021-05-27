import { FormField, Switch, TextInputField } from 'evergreen-ui';
import React, { ChangeEvent, FocusEvent, useCallback, useEffect, useState } from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';
import { ColorPickerInput } from '../inputs/color';
import { ElementControlsProps } from './element-controls-props';

export const FreeMovementControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const isFreeMovement = selectedElement?.props?.freeMovement;
  /* const [backgroundColor, setBackgroundColor] = useState(''); */
  const [freeMovement, toggleFreeMovement] = useToggle(isFreeMovement);

  const [displayState, setDisplayState] = useState({
    isFreeMovement: selectedElement?.props?.freeMovement || false,
    positionX: selectedElement?.props?.componentProps?.positionX || 0,
    positionY: selectedElement?.props?.componentProps?.positionY || 0
  });

  const [inputState, setInputState] = useState({
    freeMovement: displayState.isFreeMovement,
    positionX: displayState.positionX,
    positionY: displayState.positionY
  });

  /* useEffect(() => {
    const selectedBackgroundColor = selectedElement?.props?.backgroundColor;
    setBackgroundColor(selectedBackgroundColor || '');
  }, [selectedElement]); */

  const onToggle = () => {
    if (!freeMovement) {
      // clear positionX & positionY. Set position to last input value
      const {
        /* eslint-disable  @typescript-eslint/no-unused-vars */
        positionX,
        /* eslint-disable  @typescript-eslint/no-unused-vars */
        positionY,
        ...rest
      } = selectedElement?.props?.componentProps;
      editableElementChanged({
        componentProps: {
          ...rest
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
    }
  };

  console.log(freeMovement);

  const onChangeComponentProps = useCallback(
    (propName: string, val: string) => {
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
                if (Number.isInteger(value)) {
                  setInputState({ ...inputState, positionX: value });
                  onChangeComponentProps(
                    'left',
                    value
                  );
                } else {
                  setInputState({ ...inputState });
                }
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;
                if (Number.isInteger(value)) {
                  setInputState({ ...inputState, positionX: value });
                  onChangeComponentProps(
                    'left',
                    value
                  );
                } else {
                  setInputState({ ...inputState, positionX: value });
                }
              }}
            />
            <TextInputField
              label="Y-Coordinate"
              value={inputState.positionY}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                const { value } = e.target;
                if (Number.isInteger(value)) {
                  setInputState({ ...inputState, positionY: value });
                  onChangeComponentProps(
                    'top',
                    value
                  );
                } else {
                  setInputState({ ...inputState });
                }
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;
                if (Number.isInteger(value)) {
                  setInputState({ ...inputState, positionY: value });
                  onChangeComponentProps(
                    'top',
                    value
                  );
                } else {
                  setInputState({ ...inputState, positionY: value });
                }
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
