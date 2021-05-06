import { DeckElement } from '../types/deck-elements';
import { copyDeckElement } from './copy-deck-element';

describe('copyDeckElement', () => {
  const getElementById = jest.fn();
  const id = '123456';
  const deckElement2: DeckElement = {
    component: 'Markdown',
    id: '456',
    children: 'abc',
    parent: id
  };
  const deckElement3: DeckElement = {
    component: 'Image',
    id: '789',
    props: {
      src: 'www.images.com',
      width: '500px',
      height: 'auto'
    },
    parent: id
  };
  const deckElement1: DeckElement = {
    component: 'FlexBox',
    id,
    children: [deckElement2.id, deckElement3.id],
    props: {
      backgroundColor: 'yellowgreen'
    },
    parent: '999'
  };

  getElementById
    .mockReturnValueOnce(deckElement1)
    .mockReturnValueOnce(deckElement2)
    .mockReturnValueOnce(deckElement3);
  it('copies element', () => {
    const copiedElement = copyDeckElement(deckElement1.id, getElementById);

    expect(Object.entries(copiedElement!.elements)).toHaveLength(3);
    expect(Object.entries(copiedElement!.elements)[0]).toHaveLength(2);
    expect(Object.entries(copiedElement!.elements)[0][1].props).toEqual(
      deckElement1.props
    );
    expect(Object.entries(copiedElement!.elements)[1][1].children).toEqual(
      deckElement2.children
    );
  });
});
