import { DeckElement } from '../types/deck-elements';
import { copyDeckElement } from './copy-deck-element';
import { v4 } from 'uuid';

const id1 = v4();
const id2 = v4();
const id3 = v4();
const id4 = v4();
const id5 = v4();

describe('copyDeckElement', () => {
  const deckElement2: DeckElement = {
    component: 'Markdown',
    id: id2,
    children: 'abc',
    parent: id1
  };
  const deckElement3: DeckElement = {
    component: 'Image',
    id: id3,
    props: {
      src: 'www.images.com',
      width: '500px',
      height: 'auto'
    },
    parent: id1
  };
  const deckElement5: DeckElement = {
    component: 'Markdown',
    id: id5,
    children: 'def',
    parent: id4
  };
  const deckElement4: DeckElement = {
    component: 'FlexBox',
    id: id4,
    children: [id5],
    parent: id1
  };
  const deckElement1: DeckElement = {
    component: 'FlexBox',
    id: id1,
    children: [deckElement2.id, deckElement3.id, deckElement4.id],
    props: {
      backgroundColor: 'yellowgreen'
    },
    parent: '<SLIDE_ID>'
  };

  const getElementById = (id: string): DeckElement | undefined => {
    switch (id) {
      case id1:
        return deckElement1;
      case id2:
        return deckElement2;
      case id3:
        return deckElement3;
      case id4:
        return deckElement4;
      case id5:
        return deckElement5;
      default:
        return undefined;
    }
  };

  it('copies element', () => {
    const copiedElement = copyDeckElement(deckElement1.id, getElementById);
    expect(Object.entries(copiedElement!.elements)).toHaveLength(5);
    expect(Object.entries(copiedElement!.elements)[0]).toHaveLength(2);
    expect(Object.entries(copiedElement!.elements)[0][1].parent).toEqual(
      '<SLIDE_ID>'
    );
    expect(Object.entries(copiedElement!.elements)[1][1].parent).toEqual(
      Object.entries(copiedElement!.elements)[0][1].id
    );
    expect(Object.entries(copiedElement!.elements)[0][1].props).toEqual(
      deckElement1.props
    );
    expect(Object.entries(copiedElement!.elements)[1][1].children).toEqual(
      deckElement2.children
    );
    expect(Object.entries(copiedElement!.elements)[4][1].parent).toEqual(
      Object.entries(copiedElement!.elements)[3][1].id
    );
  });
});
