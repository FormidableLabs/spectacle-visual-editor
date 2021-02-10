import React, { useCallback, useEffect, useMemo } from 'react';
import { v4 } from 'uuid';
import { navigate } from '@reach/router';
import { SlideViewer, AppBodyStyle, SlideTimeline } from './components';
import { generateInternalSlideTree } from './components/slide-generator';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'evergreen-ui';
import { sampleSlideData } from './sample-slide-data';
import {
  activeSlideSelector,
  deckSlice,
  slidesSelector
} from './slices/deck-slice';

export const VisualEditor = () => {
  const dispatch = useDispatch();
  const slideJson = useSelector(slidesSelector);
  const activeSlideJson = useSelector(activeSlideSelector);

  const slideNodes = useMemo(() => slideJson.map(generateInternalSlideTree), [
    slideJson
  ]);

  const activeSlideNode = useMemo(
    () => (activeSlideJson ? generateInternalSlideTree(activeSlideJson) : []),
    [activeSlideJson]
  );

  const handleOpenPreviewWindow = useCallback(async () => {
    const index = slideJson.indexOf(activeSlideJson);
    await navigate(`/preview-deck?slideIndex=${index}&stepIndex=0`);
  }, [activeSlideJson, slideJson]);

  useEffect(() => {
    if (Array.isArray(slideNodes) && slideNodes.length > 0) {
      return;
    }
    dispatch(deckSlice.actions.deckLoaded(sampleSlideData));
  }, [dispatch, slideNodes]);

  return (
    <div>
      <AppBodyStyle />
      <Button onClick={() => dispatch(deckSlice.actions.newSlideAdded())}>
        Add New Slide
      </Button>
      <Button onClick={handleOpenPreviewWindow}>Preview</Button>
      <Button
        onClick={() => {
          dispatch(
            deckSlice.actions.elementAddedToActiveSlide({
              id: v4(),
              component: 'Heading',
              children: 'Oh Hello There'
            })
          );
        }}
      >
        Add New Text Box
      </Button>
      <div style={{ overflow: 'hidden' }}>
        <SlideViewer scale={0.35}>{activeSlideNode}</SlideViewer>
      </div>
      <SlideTimeline
        onSlideClick={(id) =>
          dispatch(deckSlice.actions.activeSlideWasChanged(id))
        }
      >
        {slideNodes}
      </SlideTimeline>
    </div>
  );
};
