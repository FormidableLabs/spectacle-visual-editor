import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/store.ts';
import 'tailwindcss/tailwind.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' }
};

export const decorators = [
  (Story) =>
    React.createElement(Provider, {
      store,
      children: React.createElement(Story)
    })
];
