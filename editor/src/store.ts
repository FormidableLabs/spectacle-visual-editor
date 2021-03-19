import { configureStore } from '@reduxjs/toolkit';
import { deckSlice } from './slices/deck-slice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    deck: deckSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export const useRootSelector: TypedUseSelectorHook<RootState> = useSelector;
