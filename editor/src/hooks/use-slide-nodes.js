import { useMemo } from 'react';
import { generateInternalSlideTree } from '../components/slide-generator';
import { useSelector } from 'react-redux';
import { activeSlideSelector, slidesSelector } from '../slices/deck-slice';

export const useSlideNodes = () => {
  const slideJson = useSelector(slidesSelector);
  const activeSlideJson = useSelector(activeSlideSelector);

  const slideNodes = useMemo(() => slideJson.map(generateInternalSlideTree), [
    slideJson
  ]);

  const activeSlideNode = useMemo(
    () => (activeSlideJson ? generateInternalSlideTree(activeSlideJson) : []),
    [activeSlideJson]
  );

  return { slideNodes, activeSlideNode };
};
