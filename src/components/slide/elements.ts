import { DeckElement } from '../../types/deck-elements';
import { FLEX_DIRECTION } from '../../constants/flex-direction-options';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const ELEMENTS: Record<string, Omit<DeckElement, 'id'>> = {
  HEADING: {
    component: 'Markdown',
    children: '# Oh Hello There'
  },
  TEXT: {
    component: 'Markdown',
    children: 'I am text'
  },
  LIST: {
    component: 'Markdown',
    children: `- one\n- two\n- three`
  },
  BOX: {
    component: 'FlexBox',
    props: {
      backgroundColor: 'limegreen',
      height: 100,
      width: 200,
      flexDirection: FLEX_DIRECTION.column
    },
    children: []
  },
  IMAGE: {
    component: 'Image',
    props: {
      src: 'https://source.unsplash.com/WLUHO9A_xik/1600x900',
      width: '500px',
      height: `auto`
    }
  },
  CODEPANE: {
    component: 'CodePane',
    props: { theme: vscDarkPlus, language: 'jsx' },
    children: 'let name = "Carlos";'
  }
};
