import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import { v4, validate } from 'uuid';

import { CONTAINER_ELEMENTS } from '../components/slide/elements';
import { defaultTheme } from 'spectacle';
import { searchTreeForNode } from '../util/node-search';
import { DeckElement, DeckSlide } from '../types/deck-elements';
import { RootState } from '../store';
import { SpectacleTheme } from '../types/theme';
import { isDeckElementChildren } from '../util/is-deck-element';
import undoable from 'redux-undo';

type DeckState = {
  slides: EntityState<DeckSlide>;
  activeSlideId: null | string;
  editableElementId: null | string;
  theme: SpectacleTheme;
};

type DeckElementMap = {
  [key: string]: DeckElement;
};

export const slidesAdapter = createEntityAdapter<DeckSlide>();

// Returns the immer object (instead of the js object like createSelector, createDraftSafeSelector,
// and slidesAdapter.getSelectors)
const getActiveSlide = (state: DeckState) => {
  if (!state.activeSlideId) {
    return;
  }
  return state.slides.entities[state.activeSlideId];
}

const initialState: DeckState = {
  slides: slidesAdapter.getInitialState(),
  activeSlideId: null,
  editableElementId: null,
  theme: defaultTheme
};

export const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    deckLoaded: (state, action) => {
      slidesAdapter.addMany(state.slides, action.payload);
      state.activeSlideId = action.payload[0]?.id || null;
    },

    activeSlideWasChanged: (state, action: PayloadAction<string>) => {
      if (!validate(action.payload)) {
        return;
      }

      const newActiveSlide = slidesAdapter
        .getSelectors()
        .selectById(state.slides, action.payload);

      if (newActiveSlide) {
        state.activeSlideId = newActiveSlide.id;
        state.editableElementId = null;
      }
    },

    newSlideAdded: (state) => {
      const newSlide: DeckSlide = {
        id: v4(),
        component: 'Slide',
        children: []
      };

      slidesAdapter.addOne(state.slides, newSlide);
      state.activeSlideId = newSlide.id;
    },

    elementAddedToActiveSlide: (
      state,
      action: PayloadAction<Omit<DeckElement, 'id'>>
    ) => {
      const activeSlide = getActiveSlide(state);
      if (!activeSlide) {
        return;
      }

      let node: DeckElement | null = null;
      const newElementId = v4();
      const newElement: DeckElement = { id: newElementId, ...action.payload };

      if (state.editableElementId) {
        const potentialNode = searchTreeForNode(
          activeSlide.children,
          state.editableElementId
        );
        if (CONTAINER_ELEMENTS.includes(potentialNode?.component || '')) {
          node = potentialNode;
        } else {
          node = activeSlide;
        }
      } else {
        node = activeSlide;
      }

      if (!node) {
        return;
      }

      if (Array.isArray(node?.children)) {
        node.children.push(newElement);
      } else {
        node.children = [newElement];
      }

      slidesAdapter.updateOne(state.slides, {
        id: activeSlide.id,
        changes: activeSlide
      });
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
      const activeSlide = getActiveSlide(state);

      if (!state.editableElementId || !activeSlide) {
        return;
      }

      const node = searchTreeForNode(
        activeSlide.children,
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

      slidesAdapter.updateOne(state.slides, {
        id: activeSlide.id,
        changes: activeSlide
      });
    },

    deleteSlide: (state) => {
      // Users cannot delete all slides otherwise it would break Spectacle
      if (state.slides.ids.length === 1 || !state.activeSlideId) {
        return;
      }

      slidesAdapter.removeOne(state.slides, state.activeSlideId);
      state.activeSlideId = slidesAdapter
        .getSelectors()
        .selectAll(state.slides)[0].id;
    },

    updateThemeColors: (state, action) => {
      state.theme.colors = { ...state.theme.colors, ...action.payload };
    },

    updateThemeFontSizes: (state, action) => {
      state.theme.fontSizes = { ...state.theme.fontSizes, ...action.payload };
    },

    updateThemeSize: (state, action) => {
      state.theme.size = { ...state.theme.size, ...action.payload };
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
        const slide = slidesAdapter.getSelectors().selectById(state.slides, id);
        if (slide) {
          newSlides.push(slide);
        }
      });

      slidesAdapter.setAll(state.slides, newSlides);
    },

    /**
     * Reorder the elements of the active slide given an array of ID for new order
     * @param state The draft state
     * @param action Array of IDs
     */
    reorderActiveSlideElements: (state, action: PayloadAction<string[]>) => {
      const activeSlide = getActiveSlide(state);
      if (!activeSlide || !Array.isArray(action.payload)) {
        return;
      }

      const elements = activeSlide.children || [];
      const elementsMap = elements.reduce<DeckElementMap>(
        (accum, element) => {
          accum[element.id] = element;
          return accum;
        },
        {}
      );
      const reorderedElements: DeckElement[] = action.payload
        .map((id) => elementsMap[id])
        .filter(Boolean);

      activeSlide.children = reorderedElements;
      slidesAdapter.updateOne(state.slides, {
        id: activeSlide.id,
        changes: activeSlide
      });
    },

    applyLayoutToSlide: (state, action: PayloadAction<DeckElement[]>) => {
      const activeSlide = getActiveSlide(state);
      if (!activeSlide) {
        return;
      }

      activeSlide.children = action.payload;
      slidesAdapter.updateOne(state.slides, {
        id: activeSlide.id,
        changes: activeSlide
      });
    }
  }
});

const UNDOABLE_ACTIONS = {
  [deckSlice.actions.editableElementSelected.type]: true,
  [deckSlice.actions.activeSlideWasChanged.type]: true
};

export const undoableDeckSliceReducer = undoable(deckSlice.reducer, {
  /*
   * Ignore selections
   */
  filter: function filterActions(action) {
    return !UNDOABLE_ACTIONS[action.type];
  },

  /*
   * Group edits made to the same entity
   */
  groupBy: function groupActions(action, currentState, previousHistory) {
    const { past } = previousHistory;
    const previous = past[past.length - 1];
    if (
      previous &&
      previous.editableElementId === currentState.editableElementId
    ) {
      return true;
    }
  }
});

const slidesEntitySelector = (state: RootState) => state.deck.present.slides;

export const activeSlideIdSelector = (state: RootState) => state.deck.present.activeSlideId;
export const editableElementIdSelector = (state: RootState) =>
  state.deck.present.editableElementId;
export const themeSelector = (state: RootState) => state.deck.present.theme;

export const slidesSelector = createSelector(
  slidesEntitySelector,
  (slidesEntity) => slidesAdapter.getSelectors().selectAll(slidesEntity)
);
export const activeSlideSelector = createSelector(
  slidesEntitySelector,
  activeSlideIdSelector,
  (slidesEntity, activeSlideId) => {
    if (!activeSlideId) {
      return;
    }
    return slidesAdapter.getSelectors().selectById(slidesEntity, activeSlideId);
  }
);
export const selectedElementSelector = createSelector(
  activeSlideSelector,
  editableElementIdSelector,
  (activeSlide, editableElementId) => {
    if (!activeSlide?.children || !editableElementId) {
      return null;
    }
    return searchTreeForNode(activeSlide.children, editableElementId);
  }
);
export const hasPastSelector = (state: RootState) => state.deck.past.length > 1;
export const hasFutureSelector = (state: RootState) =>
  state.deck.future.length > 0;
