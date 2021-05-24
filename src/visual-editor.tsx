import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  SlideViewer,
  AppBodyStyle,
  SlideTimeline,
  EditorBody,
  MenuBar,
  EditorCanvas,
  Inspector,
  ResizablePaneContainer,
  ResizablePaneSplitter,
  ResizablePane
} from './components';
import { sampleElementsData, sampleSlidesData } from './sample-slides-data';
import { deckSlice } from './slices/deck-slice';
import { useEditorActions, useSlideNodes, useSlideScale } from './hooks';
import { RouteComponentProps } from '@reach/router';

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
  const scale = useSlideScale(canvasRef);

  return (
    <EditorBody>
      <AppBodyStyle />
      <MenuBar />
      <ResizablePaneContainer orientation="horizontal">
        <ResizablePane minSize={300}>
          <EditorCanvas ref={canvasRef} onMouseDown={handleCanvasMouseDown}>
            <SlideViewer scale={scale}>{activeSlideNode}</SlideViewer>
          </EditorCanvas>
        </ResizablePane>

        <ResizablePaneSplitter />

        <ResizablePane initialSize={300} maxSize={600} minSize={300}>
          <Inspector />
        </ResizablePane>
      </ResizablePaneContainer>

      <SlideTimeline onSlideClick={handleSlideSelected}>
        {slideNodes}
      </SlideTimeline>
    </EditorBody>
  );
};
