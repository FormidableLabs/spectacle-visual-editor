import { DeckElement } from '../types/deck-elements';
import { copyDeckElement } from './copy-deck-element';
describe('copyDeckElement', () => {
  const getElementById = jest.fn();
  const deckElement2: DeckElement = {
    component: 'Markdown',
    id: '456',
    children: 'abc'
  };
  const deckElement3: DeckElement = {
    component: 'Image',
    id: '789',
    props: {
      src: 'www.images.com',
      width: '500px',
      height: 'auto'
    }
  };
  const deckElement1: DeckElement = {
    component: 'FlexBox',
    id: '123',
    children: [deckElement2.id, deckElement3.id],
    props: {
      backgroundColor: 'yellowgreen'
    }
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
  });
});
