import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { defaultTheme, mergeTheme, ThemeProvider } from 'evergreen-ui';
import { VisualEditor } from './visual-editor';
import { PreviewDeck } from './components';
import { store } from './store';
import { PATHS } from './constants/paths';
import { theme } from './theme';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <Provider store={store}>
    <ThemeProvider value={mergeTheme(defaultTheme, theme)}>
      <BrowserRouter>
        <Routes>
          <Route path={PATHS.VISUAL_EDITOR} element={<VisualEditor />} />
          <Route path={PATHS.PREVIEW_DECK} element={<PreviewDeck />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
