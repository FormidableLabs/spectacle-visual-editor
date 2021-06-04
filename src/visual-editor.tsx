import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WebFont from 'webfontloader';
import {
  SlideViewer,
  AppBodyStyle,
  SlideTimeline,
  EditorBody,
  MenuBar,
  EditorCanvas,
  Inspector,
  ResizablePanes,
  SavedDecks
} from './components';
import { sampleElementsData, sampleSlidesData } from './sample-slides-data';
import { deckSlice, elementsEntitySelector } from './slices/deck-slice';
import {
  useEditorActions,
  useSlideNodes,
  useSlideScale,
  useLocallyStoredState
} from './hooks';
import { RouteComponentProps } from '@reach/router';
import { settingsSelector } from './slices/settings-slice';
import { LocalStorage } from './types/local-storage';
import { defaultTheme } from 'spectacle';
import { v4 } from 'uuid';
import { editorSelector } from './slices/editor-slice';
import { Deck } from './types/deck';

export const VisualEditor: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { activeSlideNode, slideNodes } = useSlideNodes();
  const { handleCanvasMouseDown, handleSlideSelected } = useEditorActions();
  const [loadedInitialDeck, setLoadedInitialDeck] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const slideScale = useSlideScale(canvasRef);
  const { scale } = useSelector(settingsSelector);
  const { savedDecks } = useSelector(editorSelector);
  const elements = useSelector(elementsEntitySelector);

  const [initialSize, onResize] = useLocallyStoredState(
    LocalStorage.InspectorPaneWidth,
    300
  );

  // Preload a deck
  useEffect(() => {
    if (
      loadedInitialDeck ||
      (Array.isArray(slideNodes) && slideNodes.length > 0)
    ) {
      return;
    }

    let deckToLoad = {};

    if (savedDecks.length) {
      // Last saved deck
      const decksSortedByLastSaved = [...savedDecks].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      deckToLoad = decksSortedByLastSaved[0];
    } else {
      // Dummy deck
      deckToLoad = {
        id: v4(),
        title: 'Dummy Deck',
        createdAt: new Date(),
        updatedAt: new Date(),
        theme: defaultTheme,
        slides: sampleSlidesData,
        elements: sampleElementsData
      };
    }

    dispatch(deckSlice.actions.loadDeck(deckToLoad as Deck));
    setLoadedInitialDeck(true);
  }, [dispatch, savedDecks, loadedInitialDeck, slideNodes]);

  // Load in all of the font families in use
  useEffect(() => {
    const elementEntities = Object.values(elements.entities);

    if (elementEntities.length) {
      const fontFamiliesInUse = elementEntities
        .map((element) => element?.props?.componentProps?.fontFamily)
        .filter((fontFamily) => !!fontFamily);

      if (fontFamiliesInUse.length) {
        WebFont.load({
          google: {
            families: fontFamiliesInUse
          }
        });
      }
    }
  }, [elements]);

  return (
    <EditorBody>
      <AppBodyStyle />
      <MenuBar />
      <SavedDecks />
      <ResizablePanes
        orientation="horizontal"
        initialSize={initialSize}
        minSize={300}
        onResize={onResize}
      >
        <EditorCanvas
          scale={scale}
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
        >
          <SlideViewer scale={slideScale}>{activeSlideNode}</SlideViewer>
        </EditorCanvas>
        <Inspector />
      </ResizablePanes>
      <SlideTimeline onSlideClick={handleSlideSelected}>
        {slideNodes}
      </SlideTimeline>
    </EditorBody>
  );
};
