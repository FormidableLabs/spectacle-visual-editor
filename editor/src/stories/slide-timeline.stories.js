import React from 'react';
import PropTypes from 'prop-types';
import { Heading, SpectacleLogo, FlexBox } from 'spectacle';
import { Slide } from '../components/slide';
import { SlideTimeline } from '../components/slide-timeline';

export default {
  title: 'Components/SlideTimeline',
  component: SlideTimeline
};

export const Primary = ({ slideCount }) => {
  const slides = [...Array(slideCount)].map((_, index) => (
    <Slide key={`slide-${index}`} id={`slide-${index}`}>
      <FlexBox margin={20}>
        <SpectacleLogo size={300} />
      </FlexBox>
      <Heading>Hello World, Spectacle ✨</Heading>
      <Heading fontSize="h2">Slide {index}</Heading>
    </Slide>
  ));
  return <SlideTimeline onSlideClick={console.warn}>{slides}</SlideTimeline>;
};

Primary.args = { slideCount: 20 };
Primary.argTypes = {
  slideCount: { control: { type: 'number', min: 1, max: 40, step: 1 } }
};
Primary.propTypes = {
  slideCount: PropTypes.number.isRequired
};
