import { TextInputField } from 'evergreen-ui';
import React, {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import { isValidCSSSize } from '../../util/is-valid-css-size';
import { ElementControlsProps } from './element-controls-props';

export const ResizeControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const [inputState, setInputState] = useState({
    width: selectedElement?.props?.width || 0,
    height: selectedElement?.props?.height || 0
  });

  /* Update forms with values from dragged selection frame */
  useEffect(() => {
    setInputState({
      width: selectedElement?.props?.width,
      height: selectedElement?.props?.height
    });
  }, [selectedElement]);

  //   const [freeMovement, setFreeMovement] = useState(inputState.freeMovement);
  const freeMovement = selectedElement?.props?.componentProps?.isFreeMovement;

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

  return (
    <>
      {freeMovement ? (
        <SplitContainer>
          <TextInputField
            label="Width:"
            value={inputState.width}
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
              const { value } = e.target;
              handleOnEvent({
                value: value,
                shouldSetInputState: true,
                valueToChangeName: 'width',
                displayValueToChangeName: 'width',
                valueToChangeCSSName: 'width',
                valueAsCSSValue: value,
                validator: isValidCSSSize
              });
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target;
              setInputState({ ...inputState, width: value });
              handleOnEvent({
                value,
                shouldSetInputState: false,
                valueToChangeName: 'width',
                displayValueToChangeName: 'width',
                valueToChangeCSSName: 'width',
                valueAsCSSValue: value,
                validator: isValidCSSSize
              });
            }}
          />
          <TextInputField
            label="Height:"
            value={inputState.height}
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
              const { value } = e.target;
              handleOnEvent({
                value: value,
                shouldSetInputState: true,
                valueToChangeName: 'height',
                displayValueToChangeName: 'height',
                valueToChangeCSSName: 'height',
                valueAsCSSValue: value,
                validator: isValidCSSSize
              });
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target;
              setInputState({ ...inputState, height: value });
              handleOnEvent({
                value,
                shouldSetInputState: false,
                valueToChangeName: 'height',
                displayValueToChangeName: 'height',
                valueToChangeCSSName: 'height',
                valueAsCSSValue: value,
                validator: isValidCSSSize
              });
            }}
          />
        </SplitContainer>
      ) : (
        <></>
      )}
    </>
  );
};

const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 10px;
  width: calc(100% - 10px);
  margin-bottom: 12px;

  * {
    margin-bottom: 0;
  }

  > div {
    display: flex;
    align-items: center;

    label {
      min-width: 54px;
    }
  }
`;
