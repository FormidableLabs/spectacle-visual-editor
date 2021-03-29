import { useSelector } from 'react-redux';
import { SlideContext, DeckContext } from 'spectacle';
import { themeSelector } from '../../../slices/deck-slice';
import { ThemeProvider } from 'styled-components';
import React from 'react';

/**
 * Wrapper for SlideViewers
 */
export const SlideViewerWrapper: React.FC = ({ children }) => {
  const theme = useSelector(themeSelector);

  return (
    <DeckContext.Provider value={{ theme } as any}>
      <SlideContext.Provider
        value={{ activeStepIndex: 0, activationThresholds: [] } as any}
      >
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </SlideContext.Provider>
    </DeckContext.Provider>
  );
};
