import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import { v4, validate } from 'uuid';

import { defaultTheme } from 'spectacle';
import {
  ConstructedDeckElement,
  ConstructedDeckSlide,
  CONTAINER_ELEMENTS,
  DeckElement,
  DeckElementMap,
  DeckSlide
} from '../types/deck-elements';
import { RootState } from '../store';
import { SpectacleTheme } from '../types/theme';
import { constructDeckElements } from '../util/construct-deck-elements';
import { copyDeckElement } from '../util/copy-deck-element';
import { ROOT_ELEMENT } from '../templates/basic-layouts';
import undoable from 'redux-undo';
import { getChildren } from '../util/get-children';
import { LocalStorage } from '../types/local-storage';
import { Deck } from '../types/deck';
import { toaster } from 'evergreen-ui';

type DeckState = {
  id: null | string;
  title: string;
  slides: EntityState<DeckSlide>;
  elements: EntityState<DeckElement>;
  activeSlideId: null | string;
  hoveredEditableElementId: null | string;
  selectedEditableElementId: null | string;
  copiedElement: null | { id: string; elements: DeckElementMap };
  theme: SpectacleTheme;
  isSaved: boolean;
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
  id: null,
  title: '',
  slides: slidesAdapter.getInitialState(),
  elements: elementsAdapter.getInitialState(),
  activeSlideId: null,
  hoveredEditableElementId: null,
  selectedEditableElementId: null,
  copiedElement: null,
  theme: defaultTheme,
  isSaved: true
};

export const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    loadDeck: (state, action: PayloadAction<Deck>) => {
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.theme = action.payload.theme || initialState.theme;

      // Reset deck context specific properties
      state.activeSlideId =
        action.payload.slides[0]?.id || initialState.activeSlideId;
      state.hoveredEditableElementId = initialState.hoveredEditableElementId;
      state.selectedEditableElementId = initialState.selectedEditableElementId;
      state.copiedElement = initialState.copiedElement;

      slidesAdapter.removeAll(state.slides);
      elementsAdapter.removeAll(state.elements);

      slidesAdapter.addMany(state.slides, action.payload.slides);
      elementsAdapter.addMany(state.elements, action.payload.elements);

      toaster.success(`Loaded ${action.payload.title || 'Untitled Deck'}`);

      state.isSaved = true;
    },

    saveDeck: (state, action?: PayloadAction<string | null>) => {
      const storedDecks = localStorage.getItem(LocalStorage.SavedDecks);
      let newStoredDecks: Array<Deck> = [];

      if (storedDecks) {
        newStoredDecks = JSON.parse(storedDecks);
      }

      const updatedAt = new Date();
      const slides = slidesAdapter.getSelectors().selectAll(state.slides);
      const elements = elementsAdapter.getSelectors().selectAll(state.elements);

      const newDeckData = {
        updatedAt,
        title: state.title,
        theme: state.theme,
        slides,
        elements
      };

      const deckId = action?.payload;
      const deckIndex = newStoredDecks.findIndex(
        (storedDeck) => storedDeck.id === deckId
      );

      if (newStoredDecks[deckIndex]) {
        // Save existing deck
        newStoredDecks[deckIndex] = {
          ...newStoredDecks[deckIndex],
          ...newDeckData
        };
      } else {
        // Save as new deck
        const id = v4();

        newStoredDecks.push({
          ...newDeckData,
          id,
          createdAt: updatedAt
        });

        state.id = id;
      }

      localStorage.setItem(
        LocalStorage.SavedDecks,
        JSON.stringify(newStoredDecks)
      );

      toaster.success(`Saved ${state.title || 'Untitled Deck'}`);

      state.isSaved = true;
    },

    markAsUnsaved: (state) => {
      state.isSaved = false;
    },

    deleteDeck: (state, action: PayloadAction<string | null>) => {
      const deckId = action.payload;
      const storedDecks: Deck[] = JSON.parse(
        localStorage.getItem(LocalStorage.SavedDecks) || '[]'
      );
      const newStoredDecks = storedDecks.filter(
        (storedDeck) => storedDeck.id !== deckId
      );

      const deck = storedDecks.find((storedDeck) => storedDeck.id === deckId);
      toaster.success(`Deleted ${deck?.title || 'Untitled Deck'}`);

      localStorage.setItem(
        LocalStorage.SavedDecks,
        JSON.stringify(newStoredDecks)
      );
    },

    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      state.isSaved = false;
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
      state.isSaved = false;
    },

    elementAddedToActiveSlide: (
      state,
      action: PayloadAction<Omit<DeckElement, 'id' | 'parent'>>
    ) => {
      const activeSlide = getActiveSlideImmer(state);

      if (!activeSlide) {
        return;
      }

      let node: DeckElement | DeckSlide | undefined;
      const newElementId = v4();
      const newElement: DeckElement = {
        id: newElementId,
        parent: '',
        ...action.payload
      };

      if (state.selectedEditableElementId) {
        const potentialNode = getSelectedElementImmer(state);

        if (
          potentialNode &&
          CONTAINER_ELEMENTS.includes(potentialNode.component)
        ) {
          node = potentialNode;
          newElement.parent = state.selectedEditableElementId;
        } else {
          node = activeSlide;
          newElement.parent = activeSlide.id;
        }
      } else {
        node = activeSlide;
        newElement.parent = activeSlide.id;
      }

      if (!node) {
        return;
      }

      if (Array.isArray(node?.children)) {
        node.children.push(newElementId);
      } else {
        node.children = [newElementId];
      }

      elementsAdapter.addOne(state.elements, newElement);
      state.selectedEditableElementId = newElementId;
      state.isSaved = false;
    },

    editableElementHovered: (state, action) => {
      state.hoveredEditableElementId = action.payload;
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

      if (incomingChildren != null) {
        selectedElement.children = incomingChildren;
      }

      state.isSaved = false;
    },
    deleteSlide: (state, action) => {
      // The slide ID to delete can be passed via action.payload
      // If a slide ID is not provided, we assume the slide to delete is the active one
      const activeSlide = getActiveSlideImmer(state);
      const slideToDelete = action.payload
        ? state.slides.entities[action.payload]
        : getActiveSlideImmer(state);

      // Users cannot delete all slides otherwise it would break Spectacle
      if (state.slides.ids.length === 1 || !slideToDelete) return;

      let elementsToDelete: string[] = [];

      const getElementById = (id: string) =>
        elementsAdapter.getSelectors().selectById(state.elements, id);

      elementsToDelete = getChildren(slideToDelete.children, getElementById);

      elementsAdapter.removeMany(state.elements, elementsToDelete);

      slidesAdapter.removeOne(state.slides, slideToDelete.id);

      if (slideToDelete?.id === activeSlide?.id) {
        state.activeSlideId = slidesAdapter
          .getSelectors()
          .selectAll(state.slides)[0].id;
      }
    },

    updateThemeColors: (state, action) => {
      state.theme.colors = { ...state.theme.colors, ...action.payload };
      state.isSaved = false;
    },

    updateThemeFontSizes: (state, action) => {
      state.theme.fontSizes = { ...state.theme.fontSizes, ...action.payload };
      state.isSaved = false;
    },

    updateThemeSize: (state, action) => {
      state.theme.size = { ...state.theme.size, ...action.payload };
      state.isSaved = false;
    },

    deleteElement: (state) => {
      const selectedElement = getSelectedElementImmer(state);
      if (!selectedElement) return;

      const getElementById = (id: string) =>
        elementsAdapter.getSelectors().selectById(state.elements, id);

      if (
        selectedElement?.children &&
        Array.isArray(selectedElement.children)
      ) {
        const childElements = getChildren(
          selectedElement.children,
          getElementById
        );
        let parent: DeckElement | DeckSlide | undefined;
        parent =
          getElementById(selectedElement.parent) ||
          slidesAdapter
            .getSelectors()
            .selectById(state.slides, selectedElement.parent);
        if (!parent) return;

        // remove child entities of selected node
        elementsAdapter.removeMany(state.elements, childElements);

        // remove reference from parent
        elementsAdapter.updateOne(state.elements, {
          id: parent.id,
          changes: {
            children: (parent.children as string[]).filter(
              (id) => id !== selectedElement.id
            )
          }
        });
      }
      elementsAdapter.removeOne(state.elements, selectedElement.id);
      state.isSaved = false;
    },

    copyElement: (state) => {
      if (!state.selectedEditableElementId) {
        return;
      }

      const getElementById = (id: string) =>
        elementsAdapter.getSelectors().selectById(state.elements, id);

      const copiedElement = copyDeckElement(
        state.selectedEditableElementId,
        getElementById
      );

      if (copiedElement) {
        state.copiedElement = copiedElement;
      }
    },

    pasteElement: function (state) {
      if (!state.copiedElement) return;

      let selectedElement: DeckElement | undefined = undefined;

      if (state.selectedEditableElementId) {
        selectedElement = getSelectedElementImmer(state);
      }

      if (state.copiedElement) {
        if (
          selectedElement &&
          CONTAINER_ELEMENTS.includes(selectedElement.component) &&
          Array.isArray(selectedElement.children)
        ) {
          elementsAdapter.updateOne(state.elements, {
            id: selectedElement.id,
            changes: {
              children: [...selectedElement.children, state.copiedElement.id]
            }
          });
          state.copiedElement.elements[state.copiedElement.id].parent =
            selectedElement.id;
        } else {
          const activeSlide = getActiveSlideImmer(state);
          if (!activeSlide) return;
          state.copiedElement.elements[state.copiedElement.id].parent =
            activeSlide.id;
          activeSlide.children.push(state.copiedElement.id);
        }
        elementsAdapter.addMany(state.elements, state.copiedElement.elements);
      }

      // Re-copy the pasted element so that when pasted again it gets a unique set of IDs
      const getElementById = (id: string) =>
        elementsAdapter.getSelectors().selectById(state.elements, id);

      const copiedElement = copyDeckElement(
        state.copiedElement.id,
        getElementById
      );

      if (copiedElement) {
        state.copiedElement = copiedElement;
        state.isSaved = false;
      }
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
      state.isSaved = false;
    },

    reorderActiveSlideElements: (
      state,
      action: PayloadAction<{ parentId?: string; elementIds: string[] }>
    ) => {
      if (!action.payload.parentId) {
        const activeSlide = getActiveSlideImmer(state);

        if (!activeSlide) {
          return;
        }

        activeSlide.children = action.payload.elementIds;
      }

      elementsAdapter.updateOne(state.elements, {
        id: action.payload.parentId as string,
        changes: { children: action.payload.elementIds }
      });
      state.isSaved = false;
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

      action.payload.elementIds.forEach((id) => {
        if (action.payload.elementMap[id].parent === ROOT_ELEMENT) {
          action.payload.elementMap[id].parent = activeSlide.id;
        }
      });

      activeSlide.children = action.payload.elementIds;
      elementsAdapter.addMany(state.elements, action.payload.elementMap);
      state.selectedEditableElementId = null;
      state.isSaved = false;
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
      previous.selectedEditableElementId ===
        currentState.selectedEditableElementId
    ) {
      return true;
    }
  }
});

const slidesEntitySelector = (state: RootState) => state.deck.present.slides;
const elementsEntitySelector = (state: RootState) =>
  state.deck.present.elements;

export const deckSelector = (state: RootState) => state.deck.present;

export const activeSlideIdSelector = (state: RootState) =>
  state.deck.present.activeSlideId;
export const hoveredEditableElementIdSelector = (state: RootState) =>
  state.deck.present.hoveredEditableElementId;
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

    const selectedElement = elementsAdapter
      .getSelectors()
      .selectById(elementsEntity, selectedEditableElementId);
    if (!selectedElement) {
      return null;
    }

    if (Array.isArray(selectedElement.children)) {
      const getElementById = (id: string) =>
        elementsAdapter.getSelectors().selectById(elementsEntity, id);
      return {
        ...selectedElement,
        children: constructDeckElements(
          selectedElement.children,
          getElementById
        )
      } as ConstructedDeckElement;
    }

    return selectedElement as ConstructedDeckElement;
  }
);
export const hasPastSelector = (state: RootState) => state.deck.past.length > 1;
export const hasFutureSelector = (state: RootState) =>
  state.deck.future.length > 0;

export const hasPasteElementSelector = (state: RootState) =>
  state.deck.present.copiedElement !== null;
