import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import { v4, validate } from 'uuid';

import { defaultTheme } from 'spectacle';
import {
  searchTreeForNode,
  deleteInTreeForNode,
  copyNode
} from '../util/node-search';
import {
  CONTAINER_ELEMENTS,
  DeckElement,
  CopiedDeckElement,
  DeckSlide
} from '../types/deck-elements';
import { RootState } from '../store';
import { SpectacleTheme } from '../types/theme';
import { isDeckElementChildren } from '../util/is-deck-element';
import undoable from 'redux-undo';

type DeckState = {
  slides: EntityState<DeckSlide>;
  activeSlide: DeckSlide;
  editableElementId: null | string;
  copiedElement: null | CopiedDeckElement;
  theme: SpectacleTheme;
};

export const slidesAdapter = createEntityAdapter<DeckSlide>();

const initialState: DeckState = {
  slides: slidesAdapter.getInitialState(),
  activeSlide: {
    component: 'Slide',
    id: '',
    children: []
  },
  editableElementId: null,
  copiedElement: null,
  theme: defaultTheme
};

export const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    deckLoaded: (state, action) => {
      slidesAdapter.addMany(state.slides, action.payload);
      state.activeSlide = action.payload[0] || null;
    },

    activeSlideWasChanged: (state, action: PayloadAction<string>) => {
      if (!validate(action.payload)) {
        return;
      }

      const newActiveSlide = slidesAdapter
        .getSelectors()
        .selectById(state.slides, action.payload);

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

      slidesAdapter.addOne(state.slides, newSlide);
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
        if (
          potentialNode &&
          CONTAINER_ELEMENTS.includes(potentialNode.component)
        ) {
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

      slidesAdapter.updateOne(state.slides, {
        id: state.activeSlide.id,
        changes: state.activeSlide
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
      if (!state.editableElementId) {
        return;
      }

      const node = searchTreeForNode(
        state.activeSlide.children,
        state.editableElementId
      );
      if (!node) return;

      const { children: incomingChildren, ...incomingProps } = action.payload;

      node.props = { ...node.props, ...incomingProps };
      if (isDeckElementChildren(incomingChildren)) {
        node.children = incomingChildren;
      }

      slidesAdapter.updateOne(state.slides, {
        id: state.activeSlide.id,
        changes: state.activeSlide
      });
    },
    deleteSlide: (state) => {
      // Users cannot delete all slides otherwise it would break Spectacle
      if (state.slides.ids.length === 1) {
        return;
      }
      slidesAdapter.removeOne(state.slides, state.activeSlide.id);
      state.activeSlide = slidesAdapter
        .getSelectors()
        .selectAll(state.slides)[0];
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

    deleteElement: (state) => {
      if (state.activeSlide.children.length <= 0 || !state.editableElementId)
        return;

      deleteInTreeForNode(state.activeSlide.children, state.editableElementId);

      slidesAdapter.updateOne(state.slides, {
        id: state.activeSlide.id,
        changes: state.activeSlide
      });
    },

    copyElement: (state) => {
      if (!state.editableElementId) return;

      const targetNode = searchTreeForNode(
        state.activeSlide.children,
        state.editableElementId
      );

      if (!targetNode) return;

      const copiedElement = copyNode(targetNode);

      state.copiedElement = copiedElement;
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

      slidesAdapter.updateOne(state.slides, {
        id: state.activeSlide.id,
        changes: state.activeSlide
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

export const slidesSelector = (state: RootState) =>
  slidesAdapter.getSelectors().selectAll(state.deck.present.slides);
export const activeSlideSelector = (state: RootState) =>
  state.deck.present.activeSlide;
export const editableElementIdSelector = (state: RootState) =>
  state.deck.present.editableElementId;
export const currentElementSelector = (
  state: RootState
): DeckElement | null => {
  if (!state.deck.present.editableElementId) return null;
  return searchTreeForNode(
    state.deck.present.activeSlide.children,
    state.deck.present.editableElementId
  );
};
export const themeSelector = (state: RootState) => state.deck.present.theme;
export const selectedElementSelector = (state: RootState) => {
  if (
    !state.deck.present.activeSlide?.children ||
    !state.deck.present.editableElementId
  ) {
    return null;
  }
  return searchTreeForNode(
    state.deck.present.activeSlide.children,
    state.deck.present.editableElementId
  );
};
export const hasPastSelector = (state: RootState) => state.deck.past.length > 1;
export const hasFutureSelector = (state: RootState) =>
  state.deck.future.length > 0;
