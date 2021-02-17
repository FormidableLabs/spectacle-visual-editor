import { createSlice } from '@reduxjs/toolkit';
import { v4, validate } from 'uuid';
import { CONTAINER_ELEMENTS } from '../components/elements';
import { searchTreeForNode } from '../components/node-search';

export const deckSlice = createSlice({
  name: 'deck',
  initialState: {
    slides: [],
    activeSlide: null,
    editableElementId: null
  },
  reducers: {
    deckLoaded: (state, action) => {
      state.slides = action.payload;
      state.activeSlide = action.payload[0] || null;
    },
    activeSlideWasChanged: (state, action) => {
      if (!validate(action.payload)) {
        return;
      }
      state.editableElementId = null;
      state.activeSlide = state.slides.find(({ id }) => id === action.payload);
    },
    newSlideAdded: (state) => {
      const newSlide = { id: v4(), component: 'Slide', children: [] };
      state.slides.push(newSlide);
      state.activeSlide = newSlide;
    },
    elementAddedToActiveSlide: (state, action) => {
      if (!state.activeSlide) {
        return;
      }

      let node = null;
      const newElementId = v4();
      const newElement = { id: newElementId, ...action.payload };

      if (state.editableElementId) {
        const potentialNode = searchTreeForNode(
          state.activeSlide.children,
          state.editableElementId
        );
        if (CONTAINER_ELEMENTS.includes(potentialNode.component)) {
          node = potentialNode;
        } else {
          node = state.activeSlide;
        }
      } else {
        node = state.activeSlide;
      }

      if ('children' in node) {
        node.children.push(newElement);
      } else {
        node.children = [newElement];
      }

      const index = state.slides.findIndex(
        ({ id }) => id === state.activeSlide.id
      );

      state.slides[index] = state.activeSlide;
      state.editableElementId = newElementId;
    },
    editableElementSelected: (state, action) => {
      state.editableElementId = action.payload;
    },
    editableElementChanged: (state, action) => {
      const node = searchTreeForNode(
        state.activeSlide.children,
        state.editableElementId
      );
      node.props = { ...node.props, ...action.payload };

      const index = state.slides.findIndex(
        ({ id }) => id === state.activeSlide.id
      );
      state.slides[index] = state.activeSlide;
    }
  }
});

export const slidesSelector = (state) => state.deck.slides;
export const activeSlideSelector = (state) => state.deck.activeSlide;
export const editableElementIdSelector = (state) =>
  state.deck.editableElementId;
