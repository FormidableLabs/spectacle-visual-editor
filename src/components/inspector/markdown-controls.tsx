import React, {
  ChangeEvent,
  FC,
  FocusEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import WebFont from 'webfontloader';
import {
  Button,
  CaretDownIcon,
  FormField,
  Menu,
  Popover,
  TextInputField
} from 'evergreen-ui';
import styled from 'styled-components';
import { ConstructedDeckElement } from '../../types/deck-elements';
import { SelectInput } from '../inputs/select';
import {
  MD_COMPONENT_PROPS,
  TEXT_ALIGN_TYPES,
  FONT_WEIGHT_OPTIONS,
  FONT_FAMILY_OPTIONS,
  FONT_FAMILY_WEIGHTS,
  FONT_WEIGHTS
} from '../../constants/md-style-options';
import { ColorPickerInput } from '../inputs/color';
import { useRootSelector } from '../../store';
import { themeSelector } from '../../slices/deck-slice';
import { isValidCSSSize } from '../../util/is-valid-css-size';
import { SegmentedInput } from '../inputs/segmented';
import { useOnScreen } from '../../hooks';

interface Props {
  selectedElement: ConstructedDeckElement | null;
  editableElementChanged(
    element: Partial<ConstructedDeckElement['props']>
  ): void;
}

const FontFamily: FC<{ name: string }> = ({ name }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isOnScreen = useOnScreen(ref);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isOnScreen && !loaded) {
      WebFont.load({
        google: {
          families: [name]
        }
      });

      setLoaded(true);
    }
  }, [isOnScreen, name, loaded]);

  return (
    <FontFamilyPreview ref={ref} fontFamily={name}>
      {name}
    </FontFamilyPreview>
  );
};

export const MarkdownControls: FC<Props> = ({
  selectedElement,
  editableElementChanged
}) => {
  const themeValues = useRootSelector(themeSelector);
  const color: string =
    selectedElement?.props?.componentProps?.color || themeValues.colors.primary;
  const fontFamily: FONT_FAMILY_OPTIONS =
    selectedElement?.props?.componentProps?.fontFamily;
  const fontSize =
    selectedElement?.props?.componentProps?.fontSize ||
    themeValues.fontSizes.text;
  const fontWeight =
    selectedElement?.props?.componentProps?.fontWeight ||
    FONT_WEIGHT_OPTIONS.FOUR_HUNDRED;
  const textAlign =
    selectedElement?.props?.componentProps?.textAlign || TEXT_ALIGN_TYPES.LEFT;
  const [inputState, setInputState] = useState({
    color,
    fontSize
  });

  const onChangeComponentProps = useCallback(
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

  // Reset the fontWeight if it does not exist on fontFamily
  useEffect(() => {
    const fontDoesNotHaveWeight = !FONT_FAMILY_WEIGHTS?.[
      fontFamily
    ]?.weights?.includes(fontWeight);

    if (fontDoesNotHaveWeight) {
      onChangeComponentProps(
        MD_COMPONENT_PROPS.FONT_WEIGHT,
        FONT_WEIGHT_OPTIONS.FOUR_HUNDRED
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontFamily, fontWeight]);

  return (
    <Container>
      <ColorPickerInput
        label="Color"
        onUpdateValue={(value) =>
          onChangeComponentProps(MD_COMPONENT_PROPS.COLOR, value)
        }
        validValue={color}
        onChangeInput={(value) =>
          setInputState({ ...inputState, color: value })
        }
        value={inputState.color}
      />
      <FormField label="Font Family">
        <Popover
          position="bottom-left"
          content={({ close }) => (
            <Menu>
              <FontFamilyList>
                {Object.values(FONT_FAMILY_OPTIONS).map((fontFamily) => (
                  <Menu.Item
                    key={fontFamily}
                    onSelect={() => {
                      onChangeComponentProps(
                        MD_COMPONENT_PROPS.FONT_FAMILY,
                        fontFamily
                      );
                      close();
                    }}
                  >
                    <FontFamily name={fontFamily} />
                  </Menu.Item>
                ))}
              </FontFamilyList>
            </Menu>
          )}
        >
          <Button
            width="100%"
            iconAfter={CaretDownIcon}
            paddingX={10}
            justifyContent="space-between"
          >
            {fontFamily || 'Select Font Family'}
          </Button>
        </Popover>
      </FormField>
      <SplitContainer>
        <TextInputField
          label="Font Size"
          value={inputState.fontSize}
          onBlur={(e: FocusEvent<HTMLInputElement>) => {
            const { value } = e.target;
            if (isValidCSSSize(value)) {
              setInputState({ ...inputState, fontSize: value });
              onChangeComponentProps(MD_COMPONENT_PROPS.FONT_SIZE, value);
            } else {
              setInputState({ ...inputState, fontSize });
            }
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            if (isValidCSSSize(value)) {
              setInputState({ ...inputState, fontSize: value });
              onChangeComponentProps(MD_COMPONENT_PROPS.FONT_SIZE, value);
            } else {
              setInputState({ ...inputState, fontSize: value });
            }
          }}
        />
        <SelectInput
          label="Font Weight"
          value={fontWeight}
          options={
            FONT_FAMILY_WEIGHTS?.[fontFamily]?.weights?.map((weight) => ({
              value: weight,
              title: `${FONT_WEIGHTS[weight]} ${weight}`
            })) || [
              {
                value: FONT_WEIGHT_OPTIONS.FOUR_HUNDRED,
                title: FONT_WEIGHT_OPTIONS.FOUR_HUNDRED
              }
            ]
          }
          onValueChange={(value) =>
            onChangeComponentProps(MD_COMPONENT_PROPS.FONT_WEIGHT, value)
          }
        />
      </SplitContainer>
      <SegmentedInput
        label="Text Align"
        options={Object.values(TEXT_ALIGN_TYPES)}
        value={textAlign}
        onChange={(value) =>
          onChangeComponentProps(MD_COMPONENT_PROPS.TEXT_ALIGN, value)
        }
      />
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
  margin-top: 10px;

  > div {
    margin-bottom: 6px;
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

const FontFamilyList = styled.div`
  max-height: 300px;
  padding: 8px 0;
  overflow: auto;
`;

const FontFamilyPreview = styled.span<{ fontFamily: string }>`
  font-family: ${(props) => props.fontFamily}, sans-serif;
  font-display: swap;
`;
