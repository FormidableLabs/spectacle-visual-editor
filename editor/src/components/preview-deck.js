import React from 'react';
import { Deck } from 'spectacle';
import { generatePreviewSlideTree } from './slide-generator';
import { useSelector } from 'react-redux';
import { slidesSelector } from '../slices/deck-slice';

export const PreviewDeck = () => {
  const slideJson = useSelector(slidesSelector);
  return (
    <div>
      {slideJson.length && (
        <Deck>{slideJson.map(generatePreviewSlideTree)}</Deck>
      )}
    </div>
  );
};
