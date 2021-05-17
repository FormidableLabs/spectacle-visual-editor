import React from 'react';
import { MdInput } from '../inputs/md';
import { useThrottleFn } from 'react-use';
import { doesMdContainList } from '../../util/does-md-contain-list';
import { doesMdContainHeader } from '../../util/does-md-contain-heading';
import { ListControls } from './list-controls';
import { ElementControlsProps } from './element-controls-props';
import { MarkdownControls } from './markdown-controls';
import { TextControls } from './text-controls';

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
    <React.Fragment>
      <MdInput
        label="Content"
        value={String(selectedElement?.children)}
        onValueChange={(val) => editableElementChanged({ children: val })}
      />
      {doesContentContainList && (
        <>
          <MarkdownControls {...{ selectedElement, editableElementChanged }} />
          <ListControls {...{ selectedElement, editableElementChanged }} />
        </>
      )}
      {!doesContentContainHeader && !doesContentContainList && (
        <>
          <MarkdownControls {...{ selectedElement, editableElementChanged }} />
          <TextControls {...{ selectedElement, editableElementChanged }} />
        </>
      )}
    </React.Fragment>
  );
};
