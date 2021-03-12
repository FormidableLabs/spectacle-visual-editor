import React from 'react';
import PropTypes from 'prop-types';
import { Heading, SpectacleLogo, FlexBox } from 'spectacle';
import { SlideTimeline, Slide } from '../components';
import { configureStore } from '@reduxjs/toolkit';
import { deckSlice } from '../slices/deck-slice';
import { Provider } from 'react-redux';

export default {
  title: 'Components/SlideTimeline',
  component: SlideTimeline
};

const store = configureStore({
  reducer: {
    deck: deckSlice.reducer
  }
});

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
  return (
    <Provider store={store}>
      <SlideTimeline onSlideClick={console.warn}>{slides}</SlideTimeline>
    </Provider>
  );
};

Primary.args = { slideCount: 20 };
Primary.argTypes = {
  slideCount: { control: { type: 'number', min: 1, max: 40, step: 1 } }
};
Primary.propTypes = {
  slideCount: PropTypes.number.isRequired
};
