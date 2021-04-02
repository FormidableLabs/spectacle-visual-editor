import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4, validate } from 'uuid';
import { CONTAINER_ELEMENTS } from '../components';
// @ts-ignore
import defaultTheme from 'spectacle/es/theme/default-theme';
import { searchTreeForNode } from '../util/node-search';
import { DeckElement, DeckSlide } from '../types/deck-elements';
import { RootState } from '../store';
import { SpectacleTheme } from '../types/theme';
import { isDeckElementChildren } from '../util/is-deck-element';

type DeckState = {
  slides: DeckSlide[];
  activeSlide: DeckSlide;
  editableElementId: null | string;
  theme: SpectacleTheme;
};

const initialState: DeckState = {
  slides: [],
  activeSlide: {
    component: 'Slide',
    id: '',
    children: []
  },
  editableElementId: null,
  theme: defaultTheme
};

export const deckSlice = createSlice({
  name: 'deck',
  initialState: initialState,
  reducers: {
    deckLoaded: (state, action) => {
      state.slides = action.payload;
      state.activeSlide = action.payload[0] || null;
    },

    activeSlideWasChanged: (state, action: PayloadAction<string>) => {
      if (!validate(action.payload)) {
        return;
      }

      const newActiveSlide = state.slides.find(
        ({ id }) => id === action.payload
      );
      if (newActiveSlide) {
        state.activeSlide = newActiveSlide;
        state.editableElementId = null;
      }
    },

    newSlideAdded: (state) => {
      const newSlide: DeckSlide = {
        id: v4(),
        component: 'Slide',
        children: []
      };
      state.slides.push(newSlide);
      state.activeSlide = newSlide;
    },

    elementAddedToActiveSlide: (
      state,
      action: PayloadAction<Omit<DeckElement, 'id'>>
    ) => {
      if (!state.activeSlide) {
        return;
      }

      let node: DeckElement | null = null;
      const newElementId = v4();
      const newElement: DeckElement = { id: newElementId, ...action.payload };

      if (state.editableElementId) {
        const potentialNode = searchTreeForNode(
          state.activeSlide.children,
          state.editableElementId
        );
        if (CONTAINER_ELEMENTS.includes(potentialNode?.component || '')) {
          node = potentialNode;
        } else {
          node = state.activeSlide;
        }
      } else {
        node = state.activeSlide;
      }

      if (!node) {
        return;
      }

      if (Array.isArray(node?.children)) {
        node.children.push(newElement);
      } else {
        node.children = [newElement];
      }

      const index = state.slides.findIndex(
        ({ id }) => id === state?.activeSlide?.id
      );

      state.slides[index] = state.activeSlide;
      state.editableElementId = newElementId;
    },

    editableElementSelected: (state, action) => {
      state.editableElementId = action.payload;
    },

    editableElementChanged: (
      state,
      action: PayloadAction<
        | (Partial<DeckElement['props']> & {
            children?: DeckElement['children'];
          })
        | { [key: string]: unknown }
      >
    ) => {
      if (!state.editableElementId) {
        return;
      }

      const node = searchTreeForNode(
        state.activeSlide.children,
        state.editableElementId
      );
      if (!node) {
        return;
      }

      const { children: incomingChildren, ...incomingProps } = action.payload;

      node.props = { ...node.props, ...incomingProps };
      if (isDeckElementChildren(incomingChildren)) {
        node.children = incomingChildren;
      }

      const index = state.slides.findIndex(
        ({ id }) => id === state.activeSlide.id
      );
      state.slides[index] = state.activeSlide;
    },

    deleteSlide: (state, action) => {
      const index =
        action.payload ||
        state.slides.findIndex(({ id }) => id === state.activeSlide.id);
      let updatedSlides = [...state.slides];

      updatedSlides.splice(index, 1);

      if (updatedSlides.length === 0) {
        updatedSlides = [{ id: v4(), component: 'Slide', children: [] }];
      }

      state.slides = updatedSlides;
      state.activeSlide = state.slides[0];
    },

    updateThemeColors: (state, action) => {
      state.theme.colors = { ...state.theme.colors, ...action.payload };
    },

    updateThemeFontSizes: (state, action) => {
      state.theme.fontSizes = { ...state.theme.fontSizes, ...action.payload };
    },

    /**
     * Reorder the slides given an array of IDs for the new order
     * @param state The draft state
     * @param action Array of IDs
     */
    reorderSlides: (state, action: PayloadAction<string[]>) => {
      if (!Array.isArray(action.payload)) {
        return;
      }

      const newSlides: DeckSlide[] = [];
      action.payload.forEach((id) => {
        const slide = state.slides.find((s) => s.id === id);
        if (slide) {
          newSlides.push(slide);
        }
      });

      state.slides = newSlides;
    },

    /**
     * Reorder the elements of the active slide given an array of ID for new order
     * @param state The draft state
     * @param action Array of IDs
     */
    reorderActiveSlideElements: (state, action: PayloadAction<string[]>) => {
      if (!Array.isArray(action.payload)) {
        return;
      }

      const activeSlideChildren = state?.activeSlide?.children || [];

      const newElements: DeckElement[] = [];
      action.payload.forEach((id) => {
        const el = activeSlideChildren.find((e) => e.id === id);
        if (el) {
          newElements.push(el);
        }
      });

      state.activeSlide.children = newElements;
    },

    applyLayoutToSlide: (state, action: PayloadAction<DeckElement[]>) => {
      if (!state.activeSlide) {
        return;
      }

      state.activeSlide.children = action.payload;

      const index = state.slides.findIndex(
        ({ id }) => id === state?.activeSlide?.id
      );
      state.slides[index] = state.activeSlide;
    }
  }
});

export const slidesSelector = (state: RootState) => state.deck.slides;
export const activeSlideSelector = (state: RootState) => state.deck.activeSlide;
export const editableElementIdSelector = (state: RootState) =>
  state.deck.editableElementId;
export const themeSelector = (state: RootState) => state.deck.theme;
export const selectedElementSelector = (state: RootState) => {
  if (!state.deck.activeSlide?.children || !state.deck.editableElementId) {
    return null;
  }
  return searchTreeForNode(
    state.deck.activeSlide.children,
    state.deck.editableElementId
  );
};
