import { createSlice } from '@reduxjs/toolkit';

export const deckSlice = createSlice({
  name: 'deck',
  initialState: {
    slides: []
  },
  reducers: {
    loadDeck: (state, action) => ({ ...state, slides: action.payload })
  }
});

export const slidesSelector = (state) => state.deck.slides;
