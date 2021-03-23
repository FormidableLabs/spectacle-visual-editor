import React from 'react';
import { SlideViewerWrapper } from './slide-viewer-wrapper';

interface Props {
  scale: number;
  slideProps?: Record<string, any>;
}

/**
 * SlideViewer is an un-styled wrapper that provides the context data
 * required for rendering slide components.
 */
export const SlideViewer: React.FC<Props> = ({
  children,
  scale,
  slideProps
}) => {
  // Flatten out slides
  const slides = React.useMemo(() => {
    const slideEls = (children instanceof Array
      ? children
      : [children]
    ).flat() as React.ReactElement[];

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
