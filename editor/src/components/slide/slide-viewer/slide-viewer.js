import React from 'react';
import { SlideViewerWrapper } from './slide-viewer-wrapper';
import { SlideViewerPropTypes } from './slide-viewer-prop-types';

/**
 * SlideViewer is an un-styled wrapper that provides the context data
 * required for rendering slide components.
 * @param children An array of slides or single slide
 * @param scale The value at which slides should render in relation to their fixed size
 * @param slideProps Any props passed to each Slide component
 * @returns {JSX.Element}
 */
export const SlideViewer = ({ children, scale, slideProps }) => {
  // Flatten out slides
  const slides = React.useMemo(() => {
    const slideEls = (children instanceof Array ? children : [children]).flat();

    return slideEls.map((slide) => {
      return React.cloneElement(slide, {
        scale,
        slideProps,
        key: slide.props.id
      });
    });
  }, [children, scale, slideProps]);

  return <SlideViewerWrapper>{slides}</SlideViewerWrapper>;
};

SlideViewer.propTypes = SlideViewerPropTypes;
