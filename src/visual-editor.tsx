import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  SlideViewer,
  AppBodyStyle,
  SlideTimeline,
  EditorBody,
  EditorContent,
  MenuBar,
  EditorCanvas,
  Inspector
} from './components';
import { sampleSlideData } from './sample-slide-data';
import { deckSlice } from './slices/deck-slice';
import { useEditorActions, useSlideNodes, useSlideScale } from './hooks';

export const VisualEditor = () => {
  const dispatch = useDispatch();
  const { activeSlideNode, slideNodes } = useSlideNodes();
  const { handleCanvasMouseDown, handleSlideSelected } = useEditorActions();

  useEffect(() => {
    if (Array.isArray(slideNodes) && slideNodes.length > 0) {
      return;
    }
    dispatch(deckSlice.actions.deckLoaded(sampleSlideData));
  }, [dispatch, slideNodes]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const scale = useSlideScale(canvasRef);

  return (
    <EditorBody>
      <AppBodyStyle />
      <MenuBar />
      <EditorContent>
        <EditorCanvas ref={canvasRef} onMouseDown={handleCanvasMouseDown}>
          <SlideViewer scale={scale}>{activeSlideNode}</SlideViewer>
        </EditorCanvas>
        <Inspector />
      </EditorContent>
      <SlideTimeline onSlideClick={handleSlideSelected}>
        {slideNodes}
      </SlideTimeline>
    </EditorBody>
  );
};
