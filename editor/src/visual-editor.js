import React from 'react';
import { AppBodyStyle } from './components/app-styles';
import { SlideViewer } from './components/slide-viewer';
import { generateSlideTree } from './components/slide-generator';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'evergreen-ui';
import { sampleSlideData } from './sample-slide-data';
import { deckSlice, slidesSelector } from './slices/deck-slice';

const SCALE = 0.35;

export const VisualEditor = () => {
  const dispatch = useDispatch();
  const slides = useSelector(slidesSelector);
  return (
    <div>
      <AppBodyStyle />
      <Button
        onClick={() => dispatch(deckSlice.actions.loadDeck(sampleSlideData))}
      >
        Load Deck
      </Button>
      <SlideViewer scale={SCALE}>{slides.map(generateSlideTree)}</SlideViewer>
    </div>
  );
};
