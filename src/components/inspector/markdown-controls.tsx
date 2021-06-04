import React, {
  ChangeEvent,
  FC,
  FocusEvent,
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
  LIST_FONT_WEIGHT_OPTIONS,
  LIST_TEXT_ALIGN_OPTIONS,
  FONT_FAMILY_OPTIONS
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
  const fontFamily = selectedElement?.props?.componentProps?.fontFamily;
  const fontSize =
    selectedElement?.props?.componentProps?.fontSize ||
    themeValues.fontSizes.text;
  const fontWeight =
    selectedElement?.props?.componentProps?.fontWeight ||
    LIST_FONT_WEIGHT_OPTIONS.FOUR_HUNDRED;
  const textAlign =
    selectedElement?.props?.componentProps?.textAlign ||
    LIST_TEXT_ALIGN_OPTIONS.LEFT;
  const [inputState, setInputState] = useState({
    color,
    fontSize
  });

  console.log(themeValues.fonts);

  const onChangeComponentProps = (
    propName: string,
    val: string | number | boolean
  ) => {
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
          options={Object.values(LIST_FONT_WEIGHT_OPTIONS).map((op) => ({
            value: op,
            title: op
          }))}
          onValueChange={(value) =>
            onChangeComponentProps(MD_COMPONENT_PROPS.FONT_WEIGHT, value)
          }
        />
      </SplitContainer>
      <SegmentedInput
        label="Text Align"
        options={Object.values(LIST_TEXT_ALIGN_OPTIONS)}
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
