import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { SlideViewer } from './slide-viewer';

const Container = styled.div`
  background: #726e6e;
  display: flex;
  flex-direction: row;
`;

const slideContainerStyle = css`
  margin: 5px 0 5px 5px;
  &:last-child {
    margin-right: 5px;
  }
`;

/**
 * SlideTimeline is a vertical strip used to scroll and view all the slides in a deck.
 * @param children An array of slides or single slide
 * @returns {JSX.Element}
 * @constructor
 */
export const SlideTimeline = ({ children }) => {
  return (
    <Container>
      <SlideViewer containerStyles={slideContainerStyle} scale={0.1}>
        {children}
      </SlideViewer>
    </Container>
  );
};

SlideTimeline.propTypes = {
  children: PropTypes.node.isRequired
};
