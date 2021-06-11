import { useSelector } from 'react-redux';
import { SlideContext, DeckContext } from 'spectacle';
import {
  activeSlideSelector,
  slidesSelector,
  themeSelector
} from '../../../slices/deck-slice';
import { ThemeProvider } from 'styled-components';
import React, { useMemo } from 'react';

/**
 * Wrapper for SlideViewers
 */
export const SlideViewerWrapper: React.FC<{ slideIndex?: number }> = ({
  slideIndex,
  children
}) => {
  const theme = useSelector(themeSelector);
  const slides = useSelector(slidesSelector);
  const activeSlide = useSelector(activeSlideSelector);
  const activeSlideIndex = useMemo(
    () =>
      typeof slideIndex === 'number'
        ? slideIndex
        : slides.findIndex(({ id }) => id === activeSlide?.id),
    [slides, slideIndex, activeSlide]
  );

  return (
    <DeckContext.Provider
      value={
        {
          theme,
          slideCount: slides.length,
          activeView: { slideIndex: activeSlideIndex }
        } as any
      }
    >
      <SlideContext.Provider
        value={{ activeStepIndex: 0, activationThresholds: [] } as any}
      >
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </SlideContext.Provider>
    </DeckContext.Provider>
  );
};
