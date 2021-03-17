import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { defaultTheme } from 'evergreen-ui';
import { TimelineSlideViewer } from './slide-viewer/timeline-slide-viewer';

const Container = styled.div`
  background: ${defaultTheme.scales.neutral.N6};
  border-top: 1px ${defaultTheme.scales.neutral.N7} solid;
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  width: 100%;
`;

const slideContainerStyle = css`
  -webkit-touch-callout: none;
  margin: 5px 0 5px 5px;
  user-select: none;
  cursor: pointer;

  &:last-child {
    margin-right: 5px;
  }
`;

/**
 * SlideTimeline is a vertical strip used to scroll and view all the slides in a deck.
 * @param onSlideClick Function to call when a slide is clicked in the timeline
 * @param children An array of slides or single slide
 * @returns {JSX.Element}
 * @constructor
 */
export const SlideTimeline = ({ onSlideClick, children }) => {
  const handleKeyPress = useCallback(
    (event, id) => {
      if (event.keyCode === 13) {
        onSlideClick(id);
      }
    },
    [onSlideClick]
  );

  return (
    <Container>
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
    </Container>
  );
};

SlideTimeline.propTypes = {
  onSlideClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};