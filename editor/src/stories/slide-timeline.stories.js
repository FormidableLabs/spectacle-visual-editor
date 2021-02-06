import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from 'spectacle';
import { Slide } from '../components/slide';
import { SlideTimeline } from '../components/slide-timeline';

export default {
  title: 'Components/SlideTimeline',
  component: SlideTimeline
};

export const Primary = () => (
  <SlideTimeline>
    <Slide>
      <Heading>Hello World, Spectacle ✨</Heading>
    </Slide>
    <Slide>
      <Heading>Hello World, Spectacle ✨</Heading>
    </Slide>
  </SlideTimeline>
);

// Primary.args = { scale: 0.2 };
// Primary.argTypes = {
//   scale: { control: { type: 'number', min: 0.1, max: 1, step: 0.1 } }
// };
// Primary.propTypes = {
//   scale: PropTypes.number.isRequired
// };
