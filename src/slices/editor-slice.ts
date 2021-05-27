import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Deck } from '../types/deck';
import { LocalStorage } from '../types/local-storage';

type EditorState = {
  savedDecks: Deck[];
  savedDecksIsOpen: boolean;
};

const getSavedDecksFromStorage = () =>
  JSON.parse(localStorage.getItem(LocalStorage.SavedDecks) || '') || [];

const initialState: EditorState = {
  savedDecks: getSavedDecksFromStorage(),
  savedDecksIsOpen: false
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState: initialState,
  reducers: {
    refetchSavedDecks: (state) => {
      state.savedDecks = getSavedDecksFromStorage();
    },
    toggleSavedDecksMenu: (state) => {
      state.savedDecks = getSavedDecksFromStorage();
      state.savedDecksIsOpen = !state.savedDecksIsOpen;
    }
  }
});

export const editorSelector = (state: RootState) => state.editor;
