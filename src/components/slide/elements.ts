import { DeckElement } from '../../types/deck-elements';
import { FLEX_DIRECTION } from '../../constants/flex-box-options';
import { indentNormalizer } from 'spectacle';

export const ELEMENTS: Record<string, Omit<DeckElement, 'id' | 'parent'>> = {
  HEADING: {
    component: 'Markdown',
    children: '# Heading',
    props: {
      position: 'absolute',
      componentProps: {}
    }
  },
  TEXT: {
    component: 'Markdown',
    children: 'Text',
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
  IMAGE: {
    component: 'Image',
    props: {
      src: 'https://source.unsplash.com/WLUHO9A_xik/1600x900',
      width: 500,
      position: 'absolute',
      height: 400
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
