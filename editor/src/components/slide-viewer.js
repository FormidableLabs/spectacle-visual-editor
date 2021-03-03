import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { SlideContext } from 'spectacle/es/components/slide/slide';
import { useSelector } from 'react-redux';
import { themeSelector } from '../slices/deck-slice';

/**
 * SlideViewer is an un-styled wrapper that provides the context data
 * required for rendering slide components.
 * @param children An array of slides or single slide
 * @param scale The value at which slides should render in relation to their fixed size
 * @param slideProps Any props passed to each Slide component
 * @returns {JSX.Element}
 */
export const SlideViewer = ({ children, scale, slideProps }) => {
  const theme = useSelector(themeSelector);
  const slides = (children instanceof Array ? children : [children]).flat();
  return (
    <SlideContext.Provider
      value={{ activeStepIndex: 0, activationThresholds: [] }}
    >
      <ThemeProvider theme={theme}>
        {slides.map((slide) =>
          React.cloneElement(slide, {
            scale,
            slideProps,
            key: slide.props.id
          })
        )}
      </ThemeProvider>
    </SlideContext.Provider>
  );
};

SlideViewer.propTypes = {
  slideProps: PropTypes.object,
  scale: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
};
