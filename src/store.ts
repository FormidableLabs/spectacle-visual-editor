import { configureStore } from '@reduxjs/toolkit';
import { undoableDeckSliceReducer } from './slices/deck-slice';
import { settingsSlice } from './slices/settings-slice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    deck: undoableDeckSliceReducer,
    settings: settingsSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export const useRootSelector: TypedUseSelectorHook<RootState> = useSelector;
