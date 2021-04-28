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
import {
  ConstructedDeckElement,
  ConstructedDeckSlide,
  DeckElement,
  DeckElementMap,
  DeckSlide
} from '../types/deck-elements';
import { RootState } from '../store';
import { SpectacleTheme } from '../types/theme';
import { constructDeckElements } from '../util/construct-deck-elements';
import undoable from 'redux-undo';

type DeckState = {
  slides: EntityState<DeckSlide>;
  elements: EntityState<DeckElement>;
  activeSlideId: null | string;

  // TODO: CHANGE TO selectedElementId
  selectedEditableElementId: null | string;
  theme: SpectacleTheme;
};

export const slidesAdapter = createEntityAdapter<DeckSlide>();
export const elementsAdapter = createEntityAdapter<DeckElement>();

// Returns the immer object (instead of the js object like createSelector, createDraftSafeSelector,
// and slidesAdapter.getSelectors)
const getActiveSlideImmer = (state: DeckState) => {
  if (!state.activeSlideId) {
    return;
  }
  return state.slides.entities[state.activeSlideId];
};
const getSelectedElementImmer = (state: DeckState) => {
  if (!state.selectedEditableElementId) {
    return;
  }
  return state.elements.entities[state.selectedEditableElementId];
};

const initialState: DeckState = {
  slides: slidesAdapter.getInitialState(),
  elements: elementsAdapter.getInitialState(),
  activeSlideId: null,
  selectedEditableElementId: null,
  theme: defaultTheme
};

export const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    deckLoaded: (
      state,
      action: PayloadAction<{ slides: DeckSlide[]; elements: DeckElementMap }>
    ) => {
      slidesAdapter.addMany(state.slides, action.payload.slides);
      elementsAdapter.addMany(state.elements, action.payload.elements);
      state.activeSlideId = action.payload.slides[0]?.id || null;
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
        state.selectedEditableElementId = null;
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
      state.selectedEditableElementId = null;
    },

    elementAddedToActiveSlide: (
      state,
      action: PayloadAction<Omit<DeckElement, 'id'>>
    ) => {
      const activeSlide = getActiveSlideImmer(state);

      if (!activeSlide) {
        return;
      }

      let node: DeckElement | undefined;
      const newElementId = v4();
      const newElement: DeckElement = { id: newElementId, ...action.payload };

      if (state.selectedEditableElementId) {
        const potentialNode = getSelectedElementImmer(state);

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
        node.children.push(newElementId);
      } else {
        node.children = [newElementId];
      }

      slidesAdapter.updateOne(state.slides, {
        id: activeSlide.id,
        changes: activeSlide
      });
      elementsAdapter.addOne(state.elements, newElement);
      state.selectedEditableElementId = newElementId;
    },

    editableElementSelected: (state, action) => {
      state.selectedEditableElementId = action.payload;
    },

    editableElementChanged: (
      state,
      // Does not allow nested children right now, only renderable string children
      action: PayloadAction<DeckElement['props'] & { children?: string }>
    ) => {
      const selectedElement = getSelectedElementImmer(state);

      if (!selectedElement) {
        return;
      }

      const { children: incomingChildren, ...incomingProps } = action.payload;

      selectedElement.props = { ...selectedElement.props, ...incomingProps };

      if (incomingChildren) {
        selectedElement.children = incomingChildren;
      }
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
      const selectSlideById = slidesAdapter.getSelectors().selectById;

      action.payload.forEach((id) => {
        const slide = selectSlideById(state.slides, id);

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
      const activeSlide = getActiveSlideImmer(state);
      if (!activeSlide || !Array.isArray(action.payload)) {
        return;
      }

      activeSlide.children = action.payload;
    },

    applyLayoutToSlide: (
      state,
      action: PayloadAction<{
        elementIds: string[];
        elementMap: DeckElementMap;
      }>
    ) => {
      const activeSlide = getActiveSlideImmer(state);

      if (!activeSlide) {
        return;
      }

      activeSlide.children = action.payload.elementIds;
      elementsAdapter.addMany(state.elements, action.payload.elementMap);
      state.selectedEditableElementId = null;
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
      previous.selectedEditableElementId === currentState.selectedEditableElementId
    ) {
      return true;
    }
  }
});

const slidesEntitySelector = (state: RootState) => state.deck.present.slides;
const elementsEntitySelector = (state: RootState) =>
  state.deck.present.elements;

export const activeSlideIdSelector = (state: RootState) =>
  state.deck.present.activeSlideId;
export const selectedEditableElementIdSelector = (state: RootState) =>
  state.deck.present.selectedEditableElementId;
export const themeSelector = (state: RootState) => state.deck.present.theme;

export const slidesSelector = createSelector(
  slidesEntitySelector,
  elementsEntitySelector,
  (slidesEntity, elementsEntity) => {
    const getElementById = (id: string) =>
      elementsAdapter.getSelectors().selectById(elementsEntity, id);

    return slidesAdapter
      .getSelectors()
      .selectAll(slidesEntity)
      .map((slide) => {
        return {
          ...slide,
          children: constructDeckElements(slide.children, getElementById)
        } as ConstructedDeckSlide;
      });
  }
);
export const activeSlideSelector = createSelector(
  slidesEntitySelector,
  elementsEntitySelector,
  activeSlideIdSelector,
  (slidesEntity, elementsEntity, activeSlideId) => {
    if (!activeSlideId) {
      return null;
    }

    const activeSlide = slidesAdapter
      .getSelectors()
      .selectById(slidesEntity, activeSlideId);
    if (!activeSlide) {
      return null;
    }

    const getElementById = (id: string) =>
      elementsAdapter.getSelectors().selectById(elementsEntity, id);
    return {
      ...activeSlide,
      children: constructDeckElements(activeSlide.children, getElementById)
    } as ConstructedDeckSlide;
  }
);
export const selectedElementSelector = createSelector(
  elementsEntitySelector,
  selectedEditableElementIdSelector,
  (elementsEntity, selectedEditableElementId) => {
    if (!selectedEditableElementId) {
      return null;
    }

    const editableElement = elementsAdapter
      .getSelectors()
      .selectById(elementsEntity, selectedEditableElementId);
    if (!editableElement) {
      return null;
    }

    if (Array.isArray(editableElement.children)) {
      const getElementById = (id: string) =>
        elementsAdapter.getSelectors().selectById(elementsEntity, id);
      return {
        ...editableElement,
        children: constructDeckElements(
          editableElement.children,
          getElementById
        )
      } as ConstructedDeckElement;
    }

    return editableElement as ConstructedDeckElement;
  }
);
export const hasPastSelector = (state: RootState) => state.deck.past.length > 1;
export const hasFutureSelector = (state: RootState) =>
  state.deck.future.length > 0;
