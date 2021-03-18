export const ELEMENTS = {
  HEADING: {
    component: 'Markdown',
    children: '# Oh Hello There'
  },
  TEXT: {
    component: 'Markdown',
    children: 'I am text'
  },
  BOX: {
    component: 'Box',
    props: { backgroundColor: 'limegreen', height: 100, width: 200 },
    children: []
  }
};

export const CONTAINER_ELEMENTS = ['Box', 'FlexBox'];
