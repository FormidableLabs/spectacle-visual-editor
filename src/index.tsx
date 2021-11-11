import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from '@reach/router';
import { VisualEditor } from './visual-editor';
import { PreviewDeck } from './components';
import { store } from './store';
import { PATHS } from './constants/paths';

render(
  <Provider store={store}>
    <Router>
      <VisualEditor path={PATHS.VISUAL_EDITOR} />
      <PreviewDeck path={PATHS.PREVIEW_DECK} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
