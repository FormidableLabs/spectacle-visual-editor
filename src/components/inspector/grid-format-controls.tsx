import { TextInputField } from 'evergreen-ui';
import React, { useEffect, FocusEvent, ChangeEvent, useState } from 'react';
import { ElementControlsProps } from './element-controls-props';

export const GridFormatControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const columnNumber =
    selectedElement?.props?.componentProps?.columnNumber || '1';
  const rowNumber = selectedElement?.props?.componentProps?.rowNumber || '1';

  const [inputState, setInputState] = useState({
    columnNumber,
    rowNumber,
    horizontalGridGap: '',
    verticalGridGap: '',
    columnWidth: '',
    rowHeight: ''
  });

  /* Convert number of columns (integer) to a CSS percentage for grids */
  const convertNumberToGridPercent = (number: number) => {
    return 'repeat(' + number + ', ' + 100 / number + '%)';
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
              convertNumberToGridPercent(parseInt(value))
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
              convertNumberToGridPercent(parseInt(value))
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
              convertNumberToGridPercent(parseInt(value))
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
              convertNumberToGridPercent(parseInt(value))
            );
          }
        }}
      />
    </>
  );
};
