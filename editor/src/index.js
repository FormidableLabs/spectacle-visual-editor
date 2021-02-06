import 'setimmediate';
import React from 'react';
import { render } from 'react-dom';
import { VisualEditor } from './visual-editor';
import { configureStore } from '@reduxjs/toolkit';
import { deckSlice } from './slices/deck-slice';
import { Provider } from 'react-redux';

const store = configureStore({
  reducer: {
    deck: deckSlice.reducer
  }
});

render(
  <Provider store={store}>
    <VisualEditor />
  </Provider>,
  document.getElementById('root')
);
