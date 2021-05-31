import { FormField, Switch, TextInputField } from 'evergreen-ui';
import React, {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';
import { isValidCSSSize } from '../../util/is-valid-css-size';
import { ElementControlsProps } from './element-controls-props';

export const FreeMovementControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const [inputState, setInputState] = useState({
    freeMovement: selectedElement?.props?.componentProps?.isFreeMovement,
    displayPositionX: selectedElement?.props?.componentProps?.positionX || 0,
    displayPositionY: selectedElement?.props?.componentProps?.positionY || 0,
    positionX: selectedElement?.props?.componentProps?.positionX || 0,
    positionY: selectedElement?.props?.componentProps?.positionY || 0
  });

  /* Update forms with values from dragged selection frame */
  useEffect(() => {
    setInputState({
      freeMovement: selectedElement?.props?.componentProps?.isFreeMovement,
      displayPositionX: selectedElement?.props?.componentProps?.positionX,
      displayPositionY: selectedElement?.props?.componentProps?.positionY,
      positionX: selectedElement?.props?.componentProps?.positionX,
      positionY: selectedElement?.props?.componentProps?.positionY
    });
  }, [selectedElement]);

  const [freeMovement, toggleFreeMovement] = useToggle(inputState.freeMovement);

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
      displayValueToChangeName: string;
      valueToChangeName: string;
      valueToChangeCSSName: string;
      valueAsCSSValue: string;
      validator: Function;
    }) => {
      if (options.shouldSetInputState) {
        setInputState({
          ...inputState,
          [options.valueToChangeName]:
            inputState[
              options.displayValueToChangeName as keyof typeof inputState
            ]
        });
      } else if (options.validator(options.value)) {
        if (options.shouldSetInputState) {
          setInputState({
            ...inputState,
            [options.displayValueToChangeName]: options.value,
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
    [handleComponentElementChanged, handleDefaultElementChanged, inputState]
  );

  const onToggle = () => {
    if (!inputState.freeMovement) {
      setInputState({
        ...inputState,
        positionX: 0,
        positionY: 0
      });
    }
    if (!freeMovement) {
      handleOnEvent({
        value: 'absolute',
        shouldSetInputState: false,
        valueToChangeName: 'position',
        displayValueToChangeName: 'position',
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
        displayValueToChangeName: 'position',
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
          <SplitContainer>
            <TextInputField
              label="X"
              value={inputState.positionX}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                const { value } = e.target;
                handleOnEvent({
                  value: value,
                  shouldSetInputState: true,
                  valueToChangeName: 'positionX',
                  displayValueToChangeName: 'displayPositionX',
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
                  displayValueToChangeName: 'displayPositionX',
                  valueToChangeCSSName: 'left',
                  valueAsCSSValue: value,
                  validator: isValidCSSSize
                });
              }}
            />
            <TextInputField
              label="Y"
              value={inputState.positionY}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                const { value } = e.target;
                handleOnEvent({
                  value: value,
                  shouldSetInputState: true,
                  valueToChangeName: 'positionY',
                  displayValueToChangeName: 'displayPositionY',
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
                  displayValueToChangeName: 'displayPositionY',
                  valueToChangeCSSName: 'top',
                  valueAsCSSValue: value,
                  validator: isValidCSSSize
                });
              }}
            />
          </SplitContainer>
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

const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 10px;
  width: calc(100% - 10px);

  > div {
    margin-bottom: 6px;
  }
`;
