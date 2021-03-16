import { useSelector } from 'react-redux';
import { SlideContext } from 'spectacle/es/components/slide/slide';
import { themeSelector } from '../../../slices/deck-slice';
import { ThemeProvider } from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Wrapper for SlideViewers
 * @param children
 * @returns {JSX.Element}
 */
export const SlideViewerWrapper = ({ children }) => {
  const theme = useSelector(themeSelector);

  return (
    <SlideContext.Provider
      value={{ activeStepIndex: 0, activationThresholds: [] }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </SlideContext.Provider>
  );
};

SlideViewerWrapper.propTypes = {
  children: PropTypes.node.isRequired
};
