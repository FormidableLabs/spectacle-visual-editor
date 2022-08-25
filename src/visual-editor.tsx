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
import {
  sampleSlidesData,
  sampleSlideTemplateData
} from './sample-slides-data';
import {
  deckSlice,
  elementsEntitySelector,
  slideTemplateOpenSelector
} from './slices/deck-slice';
import {
  useEditorActions,
  useSlideNodes,
  useSlideScale,
  useLocallyStoredState
} from './hooks';
import { settingsSelector } from './slices/settings-slice';
import { LocalStorage } from './types/local-storage';
import { defaultTheme } from 'spectacle';
import { v4 } from 'uuid';
import { editorSelector } from './slices/editor-slice';
import { Deck } from './types/deck';
import { formatGoogleFont } from './util/format-google-font';
import {
  FONT_FAMILY_OPTIONS,
  FONT_FAMILY_WEIGHTS
} from './constants/md-style-options';

export const VisualEditor: React.FC = () => {
  const dispatch = useDispatch();
  const { activeSlideNode, slideNodes, activeTemplateNode, templateNode } =
    useSlideNodes();
  const { handleSlideSelected, handleTemplateSelected } = useEditorActions();
  const [loadedInitialDeck, setLoadedInitialDeck] = useState(false);
  const [loadedFontFamilies, setLoadedFontFamilies] = useState<Array<string>>(
    []
  );

  const canvasRef = useRef<HTMLDivElement>(null);
  const slideScale = useSlideScale(canvasRef);
  const { scale } = useSelector(settingsSelector);
  const { savedDecks } = useSelector(editorSelector);
  const slideTemplateOpen = useSelector(slideTemplateOpenSelector);
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
        title: 'Untitled Deck',
        createdAt: new Date().toJSON(),
        updatedAt: new Date().toJSON(),
        theme: defaultTheme,
        slides: sampleSlidesData,
        elements: [],
        slideTemplate: sampleSlideTemplateData
      };
    }

    dispatch(deckSlice.actions.loadDeck(deckToLoad as Deck));
    setLoadedInitialDeck(true);
  }, [dispatch, savedDecks, loadedInitialDeck, slideNodes]);

  // Load in all of the font families in use
  useEffect(() => {
    const elementEntities = Object.values(elements.entities);

    if (elementEntities.length) {
      const fontFamilies: string[] = [];

      elementEntities.forEach((element) => {
        const fontFamilyName: FONT_FAMILY_OPTIONS =
          element?.props?.componentProps?.fontFamily;

        if (fontFamilyName) {
          const fontFamily = formatGoogleFont(
            fontFamilyName,
            FONT_FAMILY_WEIGHTS[fontFamilyName].weights,
            FONT_FAMILY_WEIGHTS[fontFamilyName].italicWeights
          );

          fontFamilies.push(fontFamily);
        }
      });

      const unloadedFontFamilies = fontFamilies.filter(
        (fontFamily) => !loadedFontFamilies.includes(fontFamily)
      );

      if (unloadedFontFamilies.length) {
        WebFont.load({
          google: {
            families: unloadedFontFamilies
          }
        });

        setLoadedFontFamilies([...loadedFontFamilies, ...unloadedFontFamilies]);
      }
    }
  }, [loadedFontFamilies, elements]);

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
        <EditorCanvas scale={scale} ref={canvasRef}>
          <SlideViewer scale={slideScale}>
            {slideTemplateOpen ? activeTemplateNode : activeSlideNode}
          </SlideViewer>
        </EditorCanvas>
        <Inspector />
      </ResizablePanes>
      <SlideTimeline
        onSlideClick={handleSlideSelected}
        template={templateNode}
        onTemplateClick={handleTemplateSelected}
      >
        {slideNodes}
      </SlideTimeline>
    </EditorBody>
  );
};
