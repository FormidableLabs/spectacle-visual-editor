import {
  FormField,
  IconButton,
  Label,
  Pane,
  SegmentedControl,
  TextInputField,
  Tooltip
} from 'evergreen-ui';
import React, {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import {
  ALIGNMENT_TYPES,
  ALIGNMENT_OPTIONS
} from '../../constants/alignment-options';
import { themeSelector } from '../../slices/deck-slice';
import { useRootSelector } from '../../store';
import { isValidCSSSize } from '../../util/is-valid-css-size';
import { valueWithCSSUnits } from '../../util/value-with-css-units';
import { ElementControlsProps } from './element-controls-props';

export const FreeMovementControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const themeValues = useRootSelector(themeSelector);
  const [inputState, setInputState] = useState({
    freeMovement: selectedElement?.props?.componentProps?.isFreeMovement,
    displayPositionX: selectedElement?.props?.componentProps?.positionX || 0,
    displayPositionY: selectedElement?.props?.componentProps?.positionY || 0,
    positionX: selectedElement?.props?.componentProps?.positionX || 0,
    positionY: selectedElement?.props?.componentProps?.positionY || 0,
    width: selectedElement?.props?.width || 0,
    height: selectedElement?.props?.height || 0
  });

  /* Update forms with values from dragged selection frame */
  useEffect(() => {
    setInputState({
      freeMovement: selectedElement?.props?.componentProps?.isFreeMovement,
      displayPositionX: selectedElement?.props?.componentProps?.positionX,
      displayPositionY: selectedElement?.props?.componentProps?.positionY,
      positionX: selectedElement?.props?.componentProps?.positionX,
      positionY: selectedElement?.props?.componentProps?.positionY,
      width: selectedElement?.props?.width,
      height: selectedElement?.props?.height
    });
  }, [selectedElement]);

  const [freeMovement, setFreeMovement] = useState(inputState.freeMovement);

  const handleComponentElementChanged = useCallback(
    (propName: string, val?: string | number | boolean) => {
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
    (propName: string, val?: string | number) => {
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
      value?: string | number;
      shouldSetInputState: boolean;
      displayValueToChangeName: string;
      valueToChangeName: string;
      valueToChangeCSSName: string;
      valueAsCSSValue?: string;
      validator: Function;
    }) => {
      if (options.validator(options.value)) {
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
      } else if (options.shouldSetInputState) {
        setInputState({
          ...inputState,
          [options.valueToChangeName]:
            inputState[
              options.displayValueToChangeName as keyof typeof inputState
            ]
        });
      }
    },
    [handleComponentElementChanged, handleDefaultElementChanged, inputState]
  );

  const onToggle = () => {
    /* Initialize with 0s */
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

  const alignHorizontally = useCallback(
    (value: string) => {
      handleOnEvent({
        value,
        valueAsCSSValue: value,
        shouldSetInputState: false,
        valueToChangeName: 'positionX',
        displayValueToChangeName: 'displayPositionX',
        valueToChangeCSSName: 'left',
        validator: isValidCSSSize
      });
    },
    [handleOnEvent]
  );

  const alignVertically = useCallback(
    (value: string) => {
      handleOnEvent({
        value,
        valueAsCSSValue: value,
        shouldSetInputState: false,
        valueToChangeName: 'positionY',
        displayValueToChangeName: 'displayPositionY',
        valueToChangeCSSName: 'top',
        validator: isValidCSSSize
      });
    },
    [handleOnEvent]
  );

  const handleAlignment = useCallback(
    (type: ALIGNMENT_TYPES) => {
      const selectedElementNode = document.getElementById(
        selectedElement?.id || ''
      );

      if (!selectedElementNode) return;

      const selectedElementWidth = selectedElementNode.offsetWidth;
      const selectedElementHeight = selectedElementNode.offsetHeight;
      const { width: slideWidth, height: slideHeight } = themeValues.size;

      switch (type) {
        case ALIGNMENT_TYPES.LEFT: {
          alignHorizontally('0px');
          break;
        }
        case ALIGNMENT_TYPES.HORIZONTAL_CENTER: {
          alignHorizontally(`${slideWidth / 2 - selectedElementWidth / 2}px`);
          break;
        }
        case ALIGNMENT_TYPES.RIGHT: {
          alignHorizontally(`${slideWidth - selectedElementWidth}px`);
          break;
        }
        case ALIGNMENT_TYPES.TOP: {
          alignVertically('0px');
          break;
        }
        case ALIGNMENT_TYPES.VERTICAL_CENTER: {
          alignVertically(`${slideHeight / 2 - selectedElementHeight / 2}px`);
          break;
        }
        case ALIGNMENT_TYPES.BOTTOM: {
          alignVertically(`${slideHeight - selectedElementHeight}px`);
          break;
        }
      }
    },
    [alignHorizontally, alignVertically, selectedElement, themeValues.size]
  );

  return (
    <Container label="Object Placement">
      <SegmentedControl
        options={[
          { label: 'In-line', value: false },
          { label: 'Absolute', value: true }
        ]}
        value={freeMovement}
        onChange={() => {
          setFreeMovement(!freeMovement);
          onToggle();
        }}
      />

      {freeMovement && (
        <>
          <Pane display="flex" alignItems="center" marginBottom={8}>
            <Label minWidth={54}>Align:</Label>
            <Pane display="flex">
              {Object.keys(ALIGNMENT_OPTIONS).map((alignmentType, i) => {
                const option =
                  ALIGNMENT_OPTIONS[alignmentType as ALIGNMENT_TYPES];
                return (
                  <Tooltip content={option.tooltip} key={alignmentType}>
                    <IconButton
                      flex={1}
                      icon={option.icon}
                      marginLeft={i === 0 ? 0 : 7}
                      onClick={() =>
                        handleAlignment(alignmentType as ALIGNMENT_TYPES)
                      }
                    />
                  </Tooltip>
                );
              })}
            </Pane>
          </Pane>

          <SplitContainer>
            <TextInputField
              label="X:"
              value={inputState.positionX}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                const value = valueWithCSSUnits(e.target.value);

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
              label="Y:"
              value={inputState.positionY}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                const value = valueWithCSSUnits(e.target.value);

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
        </>
      )}
    </Container>
  );
};

const Container = styled(FormField)`
  display: grid;
  margin-top: 10px;
  > div:first-of-type {
    margin-bottom: 12px;
    label {
      font-weight: 400;
    }
  }
`;

const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 10px;
  width: calc(100% - 10px);

  > div {
    margin-bottom: 6px;
    display: flex;
    align-items: center;

    label {
      margin-bottom: 0;
      min-width: 54px;
    }
  }
`;
