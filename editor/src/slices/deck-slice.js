import { createSlice } from '@reduxjs/toolkit';
import { v4, validate } from 'uuid';

export const deckSlice = createSlice({
  name: 'deck',
  initialState: {
    slides: [],
    activeSlide: null
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
    }
  }
});

export const slidesSelector = (state) => state.deck.slides;
export const activeSlideSelector = (state) => state.deck.activeSlide;
