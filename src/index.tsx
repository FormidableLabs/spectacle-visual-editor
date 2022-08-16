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
import * as Toast from '@radix-ui/react-toast';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <Provider store={store}>
    <ThemeProvider value={mergeTheme(defaultTheme, theme)}>
      <BrowserRouter>
        <Toast.Provider>
          <Toast.Viewport className="absolute w-screen" />
          <Routes>
            <Route path={PATHS.VISUAL_EDITOR} element={<VisualEditor />} />
            <Route path={PATHS.PREVIEW_DECK} element={<PreviewDeck />} />
          </Routes>
        </Toast.Provider>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
