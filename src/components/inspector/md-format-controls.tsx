import React from 'react';
import { MdInput } from '../inputs/md';
import { useThrottleFn } from 'react-use';
import { doesMdContainList } from '../../util/does-md-contain-list';
import { doesMdContainHeader } from '../../util/does-md-contain-heading';
import { ListControls } from './list-controls';
import { ElementControlsProps } from './element-controls-props';
import { MarkdownControls } from './markdown-controls';
import { TextControls } from './text-controls';
import { Accordion } from '../user-interface/accordion';
import { FreeMovementControls } from './free-movement-controls';

export const MdFormatControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  /**
   * Since doing RegExp checking isn't "free", and some users type fast,
   * we'll throttle this check to once every 500ms.
   */
  const doesContentContainList = useThrottleFn(
    (el) => doesMdContainList(String(el?.children)),
    500,
    [selectedElement]
  );

  const doesContentContainHeader = useThrottleFn(
    (el) => doesMdContainHeader(String(el?.children)),
    500,
    [selectedElement]
  );

  return (
    <>
      <FreeMovementControls {...{ selectedElement, editableElementChanged }} />
      <Accordion label="Markdown Content">
        <MdInput
          label="Content"
          value={String(selectedElement?.children)}
          onValueChange={(val) => editableElementChanged({ children: val })}
        />
      </Accordion>
      {doesContentContainList && (
        <>
          <MarkdownControls {...{ selectedElement, editableElementChanged }} />
          <ListControls {...{ selectedElement, editableElementChanged }} />
        </>
      )}
      {!doesContentContainHeader && !doesContentContainList && (
        <>
          <Accordion label="Formatting">
            <MarkdownControls
              {...{ selectedElement, editableElementChanged }}
            />
            <TextControls {...{ selectedElement, editableElementChanged }} />
          </Accordion>
        </>
      )}
    </>
  );
};
