import 'regenerator-runtime';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from '@reach/router';
import { VisualEditor } from './visual-editor';
import { PreviewDeck } from './components';
import { store } from './store';

/**
 * TODO: remove @ts-ignores
 */
render(
  <Provider store={store}>
    <Router>
      {/* @ts-ignore */}
      <VisualEditor path="/" />
      {/* @ts-ignore */}
      <PreviewDeck path="/preview-deck" />
    </Router>
  </Provider>,
  document.getElementById('root')
);
