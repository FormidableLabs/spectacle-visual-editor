import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { deckSlice } from './slices/deck-slice';
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

export const VisualEditor: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { activeSlideNode, slideNodes } = useSlideNodes();
  const { handleCanvasMouseDown, handleSlideSelected } = useEditorActions();

  const canvasRef = useRef<HTMLDivElement>(null);
  const slideScale = useSlideScale(canvasRef);
  const { scale } = useSelector(settingsSelector);

  const [initialSize, onResize] = useLocallyStoredState(
    LocalStorage.InspectorPaneWidth,
    300
  );

  // Load dummy data
  useEffect(() => {
    if (Array.isArray(slideNodes) && slideNodes.length > 0) {
      return;
    }
    dispatch(
      deckSlice.actions.loadDeck({
        id: v4(),
        title: 'Dummy Deck',
        createdAt: new Date(),
        updatedAt: new Date(),
        theme: defaultTheme,
        slides: sampleSlidesData,
        elements: sampleElementsData
      })
    );
  }, [dispatch, slideNodes]);

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
