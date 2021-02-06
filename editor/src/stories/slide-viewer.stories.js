import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from 'spectacle';
import { SlideViewer } from '../components/slide-viewer';
import { Slide } from '../components/slide';

export default {
  title: 'Components/SlideViewer',
  component: SlideViewer
};

export const Primary = ({ scale }) => (
  <SlideViewer scale={scale}>
    <Slide id="abc-123">
      <Heading>Hello World, Spectacle ✨</Heading>
    </Slide>
  </SlideViewer>
);

Primary.args = { scale: 0.2 };
Primary.argTypes = {
  scale: { control: { type: 'number', min: 0.1, max: 1, step: 0.1 } }
};
Primary.propTypes = {
  scale: PropTypes.number.isRequired
};
