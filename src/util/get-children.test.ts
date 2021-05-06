import { DeckElement, DeckSlide } from '../types/deck-elements';
import { getChildren } from './get-children';
import { v4 } from 'uuid';
const id1 = v4();
const id2 = v4();
const id3 = v4();
const id4 = v4();
const id5 = v4();
const id6 = v4();
const id7 = v4();
const id8 = v4();
const id9 = v4();
describe('listElementsToDelete', () => {
  const slideElement: DeckSlide = {
    component: 'Slide',
    id: id7,
    children: [id1, id8]
  };
  const deckElement8: DeckElement = {
    component: 'FlexBox',
    id: id8,
    parent: id7,
    children: [id9]
  };
  const deckElement9: DeckElement = {
    component: 'Markdown',
    id: id9,
    parent: id8
  };
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
  const deckElement4: DeckElement = {
    component: 'FlexBox',
    id: id4,
    parent: '1010',
    children: [id5]
  };
  const deckElement6: DeckElement = {
    component: 'Markdown',
    id: id6,
    children: 'abc',
    parent: id1
  };
  const deckElement5: DeckElement = {
    component: 'FlexBox',
    id: id5,
    children: [id6],
    parent: id4
  };
  const deckElement1: DeckElement = {
    component: 'FlexBox',
    id: id1,
    children: [id2, id3, id4],
    props: {
      backgroundColor: 'yellowgreen'
    },
    parent: id7
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
      case id6:
        return deckElement6;
      case id8:
        return deckElement8;
      case id9:
        return deckElement9;
      default:
        return undefined;
    }
  };

  it('finds all elements to delete', () => {
    const listOfIds = getChildren(
      slideElement.children as string[],
      getElementById
    );
    expect(listOfIds).toEqual(
      expect.arrayContaining([id1, id2, id3, id4, id5, id6, id8, id9])
    );
  });
});
