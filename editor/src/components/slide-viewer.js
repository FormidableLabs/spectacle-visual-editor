import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import defaultTheme from 'spectacle/es/theme/default-theme';
import { SlideContext } from 'spectacle/es/components/slide/slide';

export const SlideViewer = ({ children, scale }) => {
  const slides = (children instanceof Array ? children : [children]).flat();
  return (
    <SlideContext.Provider
      value={{ activeStepIndex: 0, activationThresholds: [] }}
    >
      <ThemeProvider theme={defaultTheme}>
        {slides.map((slide, index) =>
          React.cloneElement(slide, { scale, key: index })
        )}
      </ThemeProvider>
    </SlideContext.Provider>
  );
};

SlideViewer.propTypes = {
  scale: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
};
