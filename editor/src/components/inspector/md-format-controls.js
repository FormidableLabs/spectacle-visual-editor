import React from 'react';
import PropTypes from 'prop-types';
import { MdInput } from '../inputs/md';

export const MdFormatControls = ({
  selectedElement,
  editableElementChanged
}) => {
  return (
    <React.Fragment>
      <MdInput
        label="Content"
        value={String(selectedElement?.children)}
        onValueChange={(val) => editableElementChanged({ children: val })}
      />
    </React.Fragment>
  );
};

MdFormatControls.propTypes = {
  selectedElement: PropTypes.object,
  editableElementChanged: PropTypes.func
};
