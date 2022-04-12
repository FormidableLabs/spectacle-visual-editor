import React, { useCallback } from 'react';
import { css } from 'styled-components';
import { TimelineSlideViewer } from './slide-viewer/timeline-slide-viewer';

const slideContainerStyle = css`
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
`;

interface Props {
  onSlideClick(id: string): void;
}

/**
 * SlideTimeline is a vertical strip used to scroll and view all the slides in a deck.
 */
export const SlideTimeline: React.FC<Props> = ({ onSlideClick, children }) => {
  const handleKeyPress = useCallback(
    (key: string, id: string) => {
      if (key === 'Enter') {
        onSlideClick(id);
      }
    },
    [onSlideClick]
  );

  return (
    <TimelineSlideViewer
      slideProps={{
        containerStyle: slideContainerStyle,
        tabIndex: 0,
        onSlideClick,
        handleKeyPress,
        role: 'button'
      }}
      scale={0.1}
    >
      {children}
    </TimelineSlideViewer>
  );
};
