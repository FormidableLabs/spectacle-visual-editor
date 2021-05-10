import { TextInputField } from 'evergreen-ui';
import React, { useEffect, FocusEvent, ChangeEvent, useState } from 'react';
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
  const rowGapSpace = selectedElement?.props?.componentProps?.rowGapSpace || '0px';
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
    return 'repeat(' + number + ', ' + (width ? width + ')' : 100 / number + '%)');
  };
  
  const onChangeDefaultProps = (propName: string, val: string) => {
    if (selectedElement) {
      editableElementChanged({
        [propName]: val
      });
    }
  };

  const onChangeComponentProps = (propName: string, val: string) => {
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
          if (Number.isInteger(parseInt(value))) {
            setInputState({ ...inputState, columnNumber: value });
            onChangeComponentProps('columnNumber', value);
            onChangeDefaultProps(
              'gridTemplateColumns',
              convertNumberToGridPercent(parseInt(value), columnWidth)
            );
          } else {
            setInputState({ ...inputState });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, columnNumber: value });
          if (Number.isInteger(parseInt(value))) {
            onChangeComponentProps('columnNumber', value);
            onChangeDefaultProps(
              'gridTemplateColumns',
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
          if (Number.isInteger(parseInt(value))) {
            setInputState({ ...inputState, rowNumber: value });
            onChangeComponentProps('rowNumber', value);
            onChangeDefaultProps(
              'gridTemplateRows',
              convertNumberToGridPercent(parseInt(value), rowHeight)
            );
          } else {
            setInputState({ ...inputState });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, rowNumber: value });
          if (Number.isInteger(parseInt(value))) {
            onChangeComponentProps('rowNumber', value);
            onChangeDefaultProps(
              'gridTemplateRows',
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
            onChangeDefaultProps('gridColumnGap', value);
          } else {
            setInputState({ ...inputState });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, columnGapSpace: value });
          if (Number.isInteger(parseInt(value))) {
            onChangeComponentProps('columnGapSpace', value);
            onChangeDefaultProps('gridColumnGap', value);
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
            onChangeDefaultProps('gridRowGap', value);
          } else {
            setInputState({ ...inputState });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, rowGapSpace: value });
          if (Number.isInteger(parseInt(value))) {
            onChangeComponentProps('rowGapSpace', value);
            onChangeDefaultProps('gridRowGap', value);
          }
        }}
      />

      <TextInputField
        label="Column Width"
        value={inputState.columnWidth}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (isValidCSSSize(value)) {
            setInputState({ ...inputState, columnWidth: value });
            onChangeComponentProps('columnWidth', value);
            onChangeDefaultProps(
              'gridTemplateColumns',
              convertNumberToGridPercent(columnNumber, value)
            );
          } else {
            setInputState({ ...inputState });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, columnWidth: value });
          if (isValidCSSSize(value)) {
            onChangeComponentProps('columnWidth', value);
            onChangeDefaultProps(
              'gridTemplateColumns',
              convertNumberToGridPercent(columnNumber,value)
            );
          }
        }}
      />

<TextInputField
        label="Row Height"
        value={inputState.rowHeight}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (isValidCSSSize(value)) {
            setInputState({ ...inputState, rowHeight: value });
            onChangeComponentProps('rowHeight', value);
            onChangeDefaultProps(
              'gridTemplateRows',
              convertNumberToGridPercent(rowNumber, value)
            );
          } else {
            setInputState({ ...inputState });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setInputState({ ...inputState, rowHeight: value });
          if (isValidCSSSize(value)) {
            onChangeComponentProps('rowHeight', value);
            onChangeDefaultProps(
              'gridTemplateRows',
              convertNumberToGridPercent(rowNumber,value)
            );
          }
        }}
      />
    </>
  );
};
