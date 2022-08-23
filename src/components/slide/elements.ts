import { DeckElement } from '../../types/deck-elements';
import { FLEX_DIRECTION } from '../../constants/flex-box-options';
import { indentNormalizer } from 'spectacle';

export const ELEMENTS: Record<string, Omit<DeckElement, 'id' | 'parent'>> = {
  HEADING: {
    component: 'Markdown',
    children: '# Oh Hello There',
    props: {
      position: 'absolute',
      componentProps: {}
    }
  },
  TEXT: {
    component: 'Markdown',
    children: 'I am text',
    props: {
      position: 'absolute',
      componentProps: {}
    }
  },
  LIST: {
    component: 'Markdown',
    children: `- one\n- two\n- three`,
    props: {
      position: 'absolute',
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
      position: 'absolute',
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
    component: 'Markdown',
    children: indentNormalizer(`
      \`\`\`javascript
      let name = "Carlos";
      \`\`\`
    `),
    props: {
      position: 'absolute',
      componentProps: {}
    }
  },
  PROGRESS: {
    component: 'Progress',
    props: {
      position: 'absolute',
      componentProps: {}
    }
  },
  FULL_SCREEN: {
    component: 'FullScreen',
    props: {
      position: 'absolute',
      componentProps: {}
    }
  }
};
