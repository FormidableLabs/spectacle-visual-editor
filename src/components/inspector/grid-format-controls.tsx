import { TextInputField } from 'evergreen-ui';
import React, { FocusEvent, ChangeEvent, useState, useCallback } from 'react';
import { GRID_COMPONENT_PROPS } from '../../constants/grid-format-options';
import { convertNumberToGridPercent } from '../../util/convert-number-to-grid';
import { isValidCSSSize } from '../../util/is-valid-css-size';
import { ElementControlsProps } from './element-controls-props';

export const GridFormatControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const [displayState, setDisplayState] = useState({
    columnNumber: selectedElement?.props?.componentProps?.columnNumber || '1',
    rowNumber: selectedElement?.props?.componentProps?.rowNumber || '1',
    columnGapSpace:
      selectedElement?.props?.componentProps?.columnGapSpace || '0px',
    rowGapSpace: selectedElement?.props?.componentProps?.rowGapSpace || '0px',
    columnWidth: selectedElement?.props?.componentProps?.columnWidth || '',
    rowHeight: selectedElement?.props?.componentProps?.rowHeight || ''
  });

  const [inputState, setInputState] = useState({
    columnNumber: displayState.columnNumber,
    rowNumber: displayState.rowNumber,
    columnGapSpace: displayState.columnGapSpace,
    rowGapSpace: displayState.rowGapSpace,
    columnWidth: displayState.columnWidth,
    rowHeight: displayState.rowHeight
  });

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

  const handleComponentElementChanged = useCallback(
    (propName: string, val: string | number) => {
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

  return (
    <>
      <TextInputField
        label="Number of Columns"
        value={inputState.columnNumber}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          const parsedValue = parseInt(value);
          handleOnEvent({
            value: parsedValue,
            shouldSetInputState: true,
            valueToChangeName: 'columnNumber',
            valueToChangeCSSName: GRID_COMPONENT_PROPS.GRID_TEMPLATE_COLUMNS,
            valueAsCSSValue: convertNumberToGridPercent(
              parseInt(value),
              inputState.columnWidth
            ),
            validator: (value: string) => {
              return Number.isInteger(parseInt(value));
            }
          });
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, columnNumber: value });
          const parsedValue = parseInt(value);
          handleOnEvent({
            value: parsedValue,
            shouldSetInputState: false,
            valueToChangeName: 'columnNumber',
            valueToChangeCSSName: GRID_COMPONENT_PROPS.GRID_TEMPLATE_COLUMNS,
            valueAsCSSValue: convertNumberToGridPercent(
              parseInt(value),
              inputState.columnWidth
            ),
            validator: (value: string) => {
              return Number.isInteger(parseInt(value));
            }
          });
        }}
      />

      <TextInputField
        label="Number of Rows"
        value={inputState.rowNumber}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          const parsedValue = parseInt(value);
          handleOnEvent({
            value: parsedValue,
            shouldSetInputState: true,
            valueToChangeName: 'rowNumber',
            valueToChangeCSSName: GRID_COMPONENT_PROPS.GRID_TEMPLATE_ROWS,
            valueAsCSSValue: convertNumberToGridPercent(
              parseInt(value),
              inputState.rowHeight
            ),
            validator: (value: string) => {
              return Number.isInteger(parseInt(value));
            }
          });
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, rowNumber: value });
          const parsedValue = parseInt(value);
          handleOnEvent({
            value: parsedValue,
            shouldSetInputState: false,
            valueToChangeName: 'rowNumber',
            valueToChangeCSSName: GRID_COMPONENT_PROPS.GRID_TEMPLATE_ROWS,
            valueAsCSSValue: convertNumberToGridPercent(
              parseInt(value),
              inputState.rowHeight
            ),
            validator: (value: string) => {
              return Number.isInteger(parseInt(value));
            }
          });
        }}
      />

      <TextInputField
        label="Space Between Columns"
        value={inputState.columnGapSpace}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          handleOnEvent({
            value,
            shouldSetInputState: true,
            valueToChangeName: 'columnGapSpace',
            valueToChangeCSSName: GRID_COMPONENT_PROPS.GRID_COLUMN_GAP,
            valueAsCSSValue: value,
            validator: isValidCSSSize
          });
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, columnGapSpace: value });
          handleOnEvent({
            value,
            shouldSetInputState: false,
            valueToChangeName: 'columnGapSpace',
            valueToChangeCSSName: GRID_COMPONENT_PROPS.GRID_COLUMN_GAP,
            valueAsCSSValue: value,
            validator: isValidCSSSize
          });
        }}
      />

      <TextInputField
        label="Space Between Rows"
        value={inputState.rowGapSpace}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          handleOnEvent({
            value,
            shouldSetInputState: true,
            valueToChangeName: 'rowGapSpace',
            valueToChangeCSSName: GRID_COMPONENT_PROPS.GRID_ROW_GAP,
            valueAsCSSValue: value,
            validator: isValidCSSSize
          });
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, rowGapSpace: value });
          handleOnEvent({
            value,
            shouldSetInputState: false,
            valueToChangeName: 'rowGapSpace',
            valueToChangeCSSName: GRID_COMPONENT_PROPS.GRID_ROW_GAP,
            valueAsCSSValue: value,
            validator: isValidCSSSize
          });
        }}
      />

      <TextInputField
        label="Column Width"
        description="Evenly distributes by default"
        value={inputState.columnWidth}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          handleOnEvent({
            value,
            shouldSetInputState: true,
            valueToChangeName: 'columnWidth',
            valueToChangeCSSName: GRID_COMPONENT_PROPS.GRID_TEMPLATE_COLUMNS,
            valueAsCSSValue: convertNumberToGridPercent(
              parseInt(inputState.columnNumber),
              value
            ),
            validator: isValidCSSSize
          });
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, columnWidth: value });
          handleOnEvent({
            value,
            shouldSetInputState: false,
            valueToChangeName: 'columnWidth',
            valueToChangeCSSName: GRID_COMPONENT_PROPS.GRID_TEMPLATE_COLUMNS,
            valueAsCSSValue: convertNumberToGridPercent(
              parseInt(inputState.columnNumber),
              value
            ),
            validator: isValidCSSSize
          });
        }}
      />

      <TextInputField
        label="Row Height"
        description="Evenly distributes by default"
        value={inputState.rowHeight}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          handleOnEvent({
            value,
            shouldSetInputState: true,
            valueToChangeName: 'rowHeight',
            valueToChangeCSSName: GRID_COMPONENT_PROPS.GRID_TEMPLATE_ROWS,
            valueAsCSSValue: convertNumberToGridPercent(
              parseInt(inputState.rowNumber),
              value
            ),
            validator: isValidCSSSize
          });
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, rowHeight: value });
          handleOnEvent({
            value,
            shouldSetInputState: false,
            valueToChangeName: 'rowHeight',
            valueToChangeCSSName: GRID_COMPONENT_PROPS.GRID_TEMPLATE_ROWS,
            valueAsCSSValue: convertNumberToGridPercent(
              parseInt(inputState.rowNumber),
              value
            ),
            validator: isValidCSSSize
          });
        }}
      />
    </>
  );
};
