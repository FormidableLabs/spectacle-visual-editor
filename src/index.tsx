import 'regenerator-runtime';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from '@reach/router';
import { ThemeProvider } from 'evergreen-ui';
import { VisualEditor } from './visual-editor';
import { PreviewDeck } from './components';
import { store } from './store';
import { PATHS } from './constants/paths';
import { theme } from './theme';

render(
  <Provider store={store}>
    <ThemeProvider value={theme}>
      <Router>
        <VisualEditor path={PATHS.VISUAL_EDITOR} />
        <PreviewDeck path={PATHS.PREVIEW_DECK} />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);
