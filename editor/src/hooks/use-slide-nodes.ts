import React, { useMemo } from 'react';
import {
  generateInternalEditableSlideTree,
  generateInternalSlideTree
} from '../components';
import { useSelector } from 'react-redux';
import { activeSlideSelector, slidesSelector } from '../slices/deck-slice';
import { DeckSlide } from '../types/deck-elements';
import { GenerateOptions } from '../components/slide/slide-generator';

export const useSlideNodes = () => {
  const slideJson = useSelector(slidesSelector);
  const activeSlideJson = useSelector(activeSlideSelector);

  const slideNodes = useMemo(
    () =>
      slideJson.map(
        generateInternalSlideTree as (opt: DeckSlide) => React.ReactElement
      ),
    [slideJson]
  );

  const activeSlideNode = useMemo(
    () =>
      activeSlideJson
        ? generateInternalEditableSlideTree(activeSlideJson as GenerateOptions)
        : [],
    [activeSlideJson]
  );

  return { slideNodes, activeSlideNode };
};
