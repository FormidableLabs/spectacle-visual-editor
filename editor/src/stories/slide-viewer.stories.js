import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from 'spectacle';
import { SlideViewer, Slide } from '../components';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { deckSlice } from '../slices/deck-slice';

export default {
  title: 'Components/SlideViewer',
  component: SlideViewer
};

const store = configureStore({
  reducer: {
    deck: deckSlice.reducer
  }
});

export const Primary = ({ scale }) => (
  <Provider store={store}>
    <SlideViewer scale={scale}>
      <Slide id="abc-123">
        <Heading>Hello World, Spectacle ✨</Heading>
      </Slide>
    </SlideViewer>
  </Provider>
);

Primary.args = { scale: 0.2 };
Primary.argTypes = {
  scale: { control: { type: 'number', min: 0.1, max: 1, step: 0.1 } }
};
Primary.propTypes = {
  scale: PropTypes.number.isRequired
};
