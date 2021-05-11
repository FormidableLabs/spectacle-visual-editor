import { TextInputField } from 'evergreen-ui';
import React, { FocusEvent, ChangeEvent, useState } from 'react';
import { GRID_COMPONENT_PROPS } from '../../constants/grid-format-options';
import { isValidCSSSize } from '../../util/is-valid-css-size';
import { ElementControlsProps } from './element-controls-props';

export const GridFormatControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const columnNumber =
    selectedElement?.props?.componentProps?.columnNumber || '1';
  const rowNumber = selectedElement?.props?.componentProps?.rowNumber || '1';
  const columnGapSpace =
    selectedElement?.props?.componentProps?.columnGapSpace || '0px';
  const rowGapSpace =
    selectedElement?.props?.componentProps?.rowGapSpace || '0px';
  const columnWidth = selectedElement?.props?.componentProps?.columnWidth || '';
  const rowHeight = selectedElement?.props?.componentProps?.rowHeight || '';

  const [inputState, setInputState] = useState({
    columnNumber,
    rowNumber,
    columnGapSpace,
    rowGapSpace,
    columnWidth,
    rowHeight
  });

  /* Convert number of columns (integer) to a CSS percentage for grids */
  const convertNumberToGridPercent = (number: number, width: string) => {
    return (
      'repeat(' + number + ', ' + (width ? width + ')' : 100 / number + '%)')
    );
  };

  const onChangeDefaultProps = (propName: string, val: string | number) => {
    if (selectedElement) {
      editableElementChanged({
        [propName]: val
      });
    }
  };

  const onChangeComponentProps = (propName: string, val: string | number) => {
    if (selectedElement) {
      editableElementChanged({
        componentProps: {
          ...selectedElement.props?.componentProps,
          [propName]: val
        }
      });
    }
  };

  return (
    <>
      <TextInputField
        label="Number of Columns"
        value={inputState.columnNumber}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          const parsedValue = parseInt(value);
          if (Number.isInteger(parsedValue)) {
            setInputState({ ...inputState, columnNumber: parsedValue });
            onChangeComponentProps('columnNumber', parsedValue);
            onChangeDefaultProps(
              GRID_COMPONENT_PROPS.GRID_TEMPLATE_COLUMNS,
              convertNumberToGridPercent(parsedValue, columnWidth)
            );
          } else {
            setInputState({ ...inputState, columnNumber });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, columnNumber: value });
          if (Number.isInteger(parseInt(value))) {
            onChangeComponentProps('columnNumber', value);
            onChangeDefaultProps(
              GRID_COMPONENT_PROPS.GRID_TEMPLATE_COLUMNS,
              convertNumberToGridPercent(parseInt(value), columnWidth)
            );
          }
        }}
      />

      <TextInputField
        label="Number of Rows"
        value={inputState.rowNumber}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          const parsedValue = parseInt(value);
          if (Number.isInteger(parsedValue)) {
            setInputState({ ...inputState, rowNumber: parsedValue });
            onChangeComponentProps('rowNumber', parsedValue);
            onChangeDefaultProps(
              GRID_COMPONENT_PROPS.GRID_TEMPLATE_ROWS,
              convertNumberToGridPercent(parsedValue, rowHeight)
            );
          } else {
            setInputState({ ...inputState, rowNumber });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, rowNumber: value });
          if (Number.isInteger(parseInt(value))) {
            onChangeComponentProps('rowNumber', value);
            onChangeDefaultProps(
              GRID_COMPONENT_PROPS.GRID_TEMPLATE_ROWS,
              convertNumberToGridPercent(parseInt(value), rowHeight)
            );
          }
        }}
      />

      <TextInputField
        label="Space Between Columns"
        value={inputState.columnGapSpace}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (isValidCSSSize(value)) {
            setInputState({ ...inputState, columnGapSpace: value });
            onChangeComponentProps('columnGapSpace', value);
            onChangeDefaultProps(GRID_COMPONENT_PROPS.GRID_COLUMN_GAP, value);
          } else {
            setInputState({ ...inputState, columnGapSpace });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, columnGapSpace: value });
          if (isValidCSSSize(value)) {
            onChangeComponentProps('columnGapSpace', value);
            onChangeDefaultProps(GRID_COMPONENT_PROPS.GRID_COLUMN_GAP, value);
          }
        }}
      />

      <TextInputField
        label="Space Between Rows"
        value={inputState.rowGapSpace}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (isValidCSSSize(value)) {
            setInputState({ ...inputState, rowGapSpace: value });
            onChangeComponentProps('rowGapSpace', value);
            onChangeDefaultProps(GRID_COMPONENT_PROPS.GRID_ROW_GAP, value);
          } else {
            setInputState({ ...inputState, rowGapSpace });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, rowGapSpace: value });
          if (isValidCSSSize(value)) {
            onChangeComponentProps('rowGapSpace', value);
            onChangeDefaultProps(GRID_COMPONENT_PROPS.GRID_ROW_GAP, value);
          }
        }}
      />

      <TextInputField
        label="Column Width"
        description="Evenly distributes by default"
        value={inputState.columnWidth}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (isValidCSSSize(value)) {
            setInputState({ ...inputState, columnWidth: value });
            onChangeComponentProps('columnWidth', value);
            onChangeDefaultProps(
              GRID_COMPONENT_PROPS.GRID_TEMPLATE_COLUMNS,
              convertNumberToGridPercent(columnNumber, value)
            );
          } else {
            setInputState({ ...inputState, columnWidth });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, columnWidth: value });
          if (isValidCSSSize(value)) {
            onChangeComponentProps('columnWidth', value);
            onChangeDefaultProps(
              GRID_COMPONENT_PROPS.GRID_TEMPLATE_COLUMNS,
              convertNumberToGridPercent(columnNumber, value)
            );
          }
        }}
      />

      <TextInputField
        label="Row Height"
        description="Evenly distributes by default"
        value={inputState.rowHeight}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (isValidCSSSize(value)) {
            setInputState({ ...inputState, rowHeight: value });
            onChangeComponentProps('rowHeight', value);
            onChangeDefaultProps(
              GRID_COMPONENT_PROPS.GRID_TEMPLATE_ROWS,
              convertNumberToGridPercent(rowNumber, value)
            );
          } else {
            setInputState({ ...inputState, rowHeight });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, rowHeight: value });
          if (isValidCSSSize(value)) {
            onChangeComponentProps('rowHeight', value);
            onChangeDefaultProps(
              GRID_COMPONENT_PROPS.GRID_TEMPLATE_ROWS,
              convertNumberToGridPercent(rowNumber, value)
            );
          }
        }}
      />
    </>
  );
};
