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
  ResizablePanes
} from './components';
import { sampleElementsData, sampleSlidesData } from './sample-slides-data';
import { deckSlice } from './slices/deck-slice';
import { useEditorActions, useSlideNodes, useSlideScale } from './hooks';
import { RouteComponentProps } from '@reach/router';
import { settingsSelector } from './slices/settings-slice';

export const VisualEditor: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { activeSlideNode, slideNodes } = useSlideNodes();
  const { handleCanvasMouseDown, handleSlideSelected } = useEditorActions();

  useEffect(() => {
    if (Array.isArray(slideNodes) && slideNodes.length > 0) {
      return;
    }
    dispatch(
      deckSlice.actions.deckLoaded({
        slides: sampleSlidesData,
        elements: sampleElementsData
      })
    );
  }, [dispatch, slideNodes]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const slideScale = useSlideScale(canvasRef);
  const { scale } = useSelector(settingsSelector);

  return (
    <EditorBody>
      <AppBodyStyle />
      <MenuBar />
      <ResizablePanes orientation="horizontal" initialSize={300} minSize={300}>
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
