import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Deck } from '../types/deck';
import { LocalStorage } from '../types/local-storage';
import { parseJSON } from '../util/parse-json';

type EditorState = {
  savedDecks: Deck[];
  savedDecksIsOpen: boolean;
};

const getSavedDecksFromStorage = () => {
  const savedDecksStorageItem = localStorage.getItem(LocalStorage.SavedDecks);
  return savedDecksStorageItem ? parseJSON(savedDecksStorageItem) : [];
};

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
