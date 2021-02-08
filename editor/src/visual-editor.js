import React, { useEffect, useMemo } from 'react';
import { v4 } from 'uuid';
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

  useEffect(() => {
    dispatch(deckSlice.actions.deckLoaded(sampleSlideData));
  }, [dispatch]);

  return (
    <div>
      <AppBodyStyle />
      <Button onClick={() => dispatch(deckSlice.actions.newSlideAdded())}>
        Add New Slide
      </Button>
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
