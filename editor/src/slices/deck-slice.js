import { createSlice, current } from '@reduxjs/toolkit';
import { v4, validate } from 'uuid';

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
      state.activeSlide.children.push(action.payload);

      const index = state.slides.findIndex(
        ({ id }) => id === state.activeSlide.id
      );
      state.slides[index] = state.activeSlide;
      state.editableElementId = action.payload.id;
    },
    editableElementSelected: (state, action) => {
      state.editableElementId = action.payload;
    },
    editableElementChanged: (state, action) => {
      const searchChildrenForId = (tree, id) => {
        let found = false;
        for (const [index] of current(tree).entries()) {
          const node = tree[index];
          const dataNode = current(node);
          if (dataNode.id === id) {
            node.props = { ...node.props, ...action.payload };
            found = true;
          }
          if (!found && 'children' in dataNode && Array.isArray(dataNode)) {
            searchChildrenForId(node.children, id);
          } else if (
            !found &&
            'children' in dataNode &&
            Array.isArray(dataNode.children)
          ) {
            searchChildrenForId(node.children, id);
          } else if (found) {
            break;
          }
        }
      };
      searchChildrenForId(state.activeSlide.children, state.editableElementId);
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
