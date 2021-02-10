import 'regenerator-runtime';
import 'setimmediate';
import React from 'react';
import { render } from 'react-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { Router } from '@reach/router';
import { deckSlice } from './slices/deck-slice';
import { VisualEditor } from './visual-editor';
import { PreviewDeck } from './components/preview-deck';

const store = configureStore({
  reducer: {
    deck: deckSlice.reducer
  }
});

render(
  <Provider store={store}>
    <Router>
      <VisualEditor path="/" />
      <PreviewDeck path="/preview-deck" />
    </Router>
  </Provider>,
  document.getElementById('root')
);
