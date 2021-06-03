import { DeckElement } from '../../types/deck-elements';
import { FLEX_DIRECTION } from '../../constants/flex-box-options';

export const ELEMENTS: Record<string, Omit<DeckElement, 'id' | 'parent'>> = {
  HEADING: {
    component: 'Markdown',
    children: '# Oh Hello There',
    props: {
      componentProps: {}
    }
  },
  TEXT: {
    component: 'Markdown',
    children: 'I am text',
    props: {
      componentProps: {}
    }
  },
  LIST: {
    component: 'Markdown',
    children: `- one\n- two\n- three`,
    props: {
      componentProps: {}
    }
  },
  BOX: {
    component: 'FlexBox',
    props: {
      backgroundColor: 'limegreen',
      borderColor: '#ffffff',
      height: 100,
      width: 200,
      flexDirection: FLEX_DIRECTION.column,
      componentProps: {}
    },
    children: []
  },
  GRID: {
    component: 'Grid',
    props: {
      width: '100%',
      height: '100%',
      gridTemplateColumns: '100%',
      gridTemplateRows: '100%'
    }
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
    props: { language: 'javascript' },
    children: 'let name = "Carlos";'
  }
};
