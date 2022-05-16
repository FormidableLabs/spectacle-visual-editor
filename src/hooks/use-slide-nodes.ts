import React, { useMemo } from 'react';
import {
  generateInternalEditableSlideTree,
  generateInternalSlideTree
} from '../components';
import { useSelector } from 'react-redux';
import {
  activeSlideSelector,
  slidesSelector,
  constructedSlideTemplateSelector
} from '../slices/deck-slice';
import { ConstructedDeckSlide } from '../types/deck-elements';
import { GenerateOptions } from '../components/slide/slide-generator';

export const useSlideNodes = () => {
  const slideJson = useSelector(slidesSelector);
  const activeSlideJson = useSelector(activeSlideSelector);
  const slideTemplateJson = useSelector(constructedSlideTemplateSelector);

  const slideNodes = useMemo(
    () =>
      slideJson.map(
        generateInternalSlideTree as (
          opt: ConstructedDeckSlide
        ) => React.ReactElement
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

  const slideTemplateNode = useMemo(
    () =>
      slideTemplateJson
        ? generateInternalEditableSlideTree(
            slideTemplateJson as GenerateOptions
          )
        : [],
    [slideTemplateJson]
  );

  return { slideNodes, activeSlideNode, slideTemplateNode };
};
