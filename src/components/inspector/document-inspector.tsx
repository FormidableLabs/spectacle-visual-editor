import React from 'react';
import { Pane } from './inspector-styles';
import { ThemeValues } from './theme-values';

export const DocumentInspector = () => {
  return (
    <Pane padding={10}>
      <ThemeValues />
    </Pane>
  );
};
