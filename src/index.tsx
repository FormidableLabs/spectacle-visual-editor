import 'regenerator-runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Router } from '@reach/router';
import { defaultTheme, mergeTheme, ThemeProvider } from 'evergreen-ui';
import { VisualEditor } from './visual-editor';
import { PreviewDeck } from './components';
import { store } from './store';
import { PATHS } from './constants/paths';
import { theme } from './theme';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <Provider store={store}>
    <ThemeProvider value={mergeTheme(defaultTheme, theme)}>
      <Router>
        <VisualEditor path={PATHS.VISUAL_EDITOR} />
        <PreviewDeck path={PATHS.PREVIEW_DECK} />
      </Router>
    </ThemeProvider>
  </Provider>
);
