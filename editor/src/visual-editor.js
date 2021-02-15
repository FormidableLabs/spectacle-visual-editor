import React, { useEffect } from 'react';
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
import { useElementSelection, useSlideNodes } from './hooks';

export const VisualEditor = () => {
  const dispatch = useDispatch();
  const { activeSlideNode, slideNodes } = useSlideNodes();
  const {
    handleContentMouseDown,
    handleCanvasMouseDown
  } = useElementSelection();

  useEffect(() => {
    if (Array.isArray(slideNodes) && slideNodes.length > 0) {
      return;
    }
    dispatch(deckSlice.actions.deckLoaded(sampleSlideData));
  }, [dispatch, slideNodes]);

  return (
    <EditorBody>
      <AppBodyStyle />
      <MenuBar />
      <EditorContent onMouseDown={handleContentMouseDown}>
        <EditorCanvas onMouseDown={handleCanvasMouseDown}>
          <SlideViewer scale={0.45}>{activeSlideNode}</SlideViewer>
        </EditorCanvas>
        <Inspector />
      </EditorContent>
      <SlideTimeline
        onSlideClick={(id) =>
          dispatch(deckSlice.actions.activeSlideWasChanged(id))
        }
      >
        {slideNodes}
      </SlideTimeline>
    </EditorBody>
  );
};
