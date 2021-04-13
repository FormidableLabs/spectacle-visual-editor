import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type SettingsState = {
  scale: string;
};

const initialState: SettingsState = {
  scale: 'fit'
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {
    updateScale: (state, action) => {
      state.scale = action.payload;
    }
  }
});

export const settingsSelector = (state: RootState) => state.settings;
