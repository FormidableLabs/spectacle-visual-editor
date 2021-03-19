import React from 'react';
import PropTypes from 'prop-types';
import { TextareaField } from 'evergreen-ui';

export const MdInput = ({ label, value, onValueChange }) => {
  return (
    <TextareaField
      label={label}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      autoFocus
    />
  );
};

MdInput.propTypes = {
  label: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};
