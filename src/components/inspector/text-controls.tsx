import React, { ChangeEvent, FocusEvent, useCallback, useState } from 'react';
import { ConstructedDeckElement } from '../../types/deck-elements';
import { FormField, TextInputField, Switch } from 'evergreen-ui';
import styled from 'styled-components';
import { isValidCSSSize } from '../../util/is-valid-css-size';
import { useToggle } from '../../hooks';
import { MD_COMPONENT_PROPS } from '../../constants/md-style-options';
import { useRootSelector } from '../../store';
import { themeSelector } from '../../slices/deck-slice';

interface Props {
  selectedElement: ConstructedDeckElement | null;
  editableElementChanged(
    element: Partial<ConstructedDeckElement['props']>
  ): void;
}

export const TextControls: React.FC<Props> = ({
  selectedElement,
  editableElementChanged
}) => {
  const themeValues = useRootSelector(themeSelector);
  const margin =
    selectedElement?.props?.componentProps.margin ||
    `${themeValues.space[0]}px`;
  const horizontalMargin =
    selectedElement?.props?.componentProps[
      MD_COMPONENT_PROPS.MARGIN_HORIZONTAL
    ] || `${themeValues.space[0]}px`;
  const verticalMargin =
    selectedElement?.props?.componentProps[
      MD_COMPONENT_PROPS.MARGIN_VERTICAL
    ] || `${themeValues.space[0]}px`;
  const isSingleMargin = !Boolean(
    selectedElement?.props?.componentProps[
      MD_COMPONENT_PROPS.MARGIN_VERTICAL
    ] ||
      selectedElement?.props?.componentProps[
        MD_COMPONENT_PROPS.MARGIN_HORIZONTAL
      ]
  );
  const [marginDoubleValue, toggleMarginDoubleValue] =
    useToggle(isSingleMargin);
  const [inputState, setInputState] = useState({
    margin,
    horizontalMargin,
    verticalMargin
  });

  const onToggle = () => {
    if (!marginDoubleValue) {
      // clear marginX & marginY. Set margin to last input value
      const {
        /* eslint-disable  @typescript-eslint/no-unused-vars */
        marginX,
        /* eslint-disable  @typescript-eslint/no-unused-vars */
        marginY,
        ...rest
      } = selectedElement?.props?.componentProps;
      editableElementChanged({
        componentProps: {
          ...rest,
          margin: inputState.margin
        }
      });
    } else {
      // clear margin. Set horizontal & vertical margin to last input values
      editableElementChanged({
        componentProps: {
          ...selectedElement?.props?.componentProps,
          margin: '',
          marginX: inputState.horizontalMargin,
          marginY: inputState.verticalMargin
        }
      });
    }
  };

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
    <Container label="Margins">
      <SwitchContainer label="Use single value for margin">
        <Switch
          checked={marginDoubleValue}
          onChange={() => {
            toggleMarginDoubleValue();
            onToggle();
          }}
        />
      </SwitchContainer>

      {marginDoubleValue ? (
        <TextInputField
          label="Margin size"
          value={inputState.margin}
          onBlur={(e: FocusEvent<HTMLInputElement>) => {
            const { value } = e.target;
            if (isValidCSSSize(value)) {
              setInputState({ ...inputState, margin: value });
              onChangeComponentProps(MD_COMPONENT_PROPS.MARGIN, value);
            } else {
              setInputState({ ...inputState, margin });
            }
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            if (isValidCSSSize(value)) {
              setInputState({ ...inputState, margin: value });
              onChangeComponentProps(MD_COMPONENT_PROPS.MARGIN, value);
            } else {
              setInputState({ ...inputState, margin: value });
            }
          }}
        />
      ) : (
        <>
          <TextInputField
            label="Horizontal margin size"
            value={inputState.horizontalMargin}
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
              const { value } = e.target;
              if (isValidCSSSize(value)) {
                setInputState({ ...inputState, horizontalMargin: value });
                onChangeComponentProps(
                  MD_COMPONENT_PROPS.MARGIN_HORIZONTAL,
                  value
                );
              } else {
                setInputState({ ...inputState, margin });
              }
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target;
              if (isValidCSSSize(value)) {
                setInputState({ ...inputState, horizontalMargin: value });
                onChangeComponentProps(
                  MD_COMPONENT_PROPS.MARGIN_HORIZONTAL,
                  value
                );
              } else {
                setInputState({ ...inputState, horizontalMargin: value });
              }
            }}
          />
          <TextInputField
            label="Vertical margin size"
            value={inputState.verticalMargin}
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
              const { value } = e.target;
              if (isValidCSSSize(value)) {
                setInputState({ ...inputState, verticalMargin: value });
                onChangeComponentProps(
                  MD_COMPONENT_PROPS.MARGIN_VERTICAL,
                  value
                );
              } else {
                setInputState({ ...inputState, verticalMargin });
              }
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target;
              if (isValidCSSSize(value)) {
                setInputState({ ...inputState, verticalMargin: value });
                onChangeComponentProps(
                  MD_COMPONENT_PROPS.MARGIN_VERTICAL,
                  value
                );
              } else {
                setInputState({ ...inputState, verticalMargin: value });
              }
            }}
          />
        </>
      )}
    </Container>
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
