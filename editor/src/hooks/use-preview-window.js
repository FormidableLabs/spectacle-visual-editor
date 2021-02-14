import { useCallback } from 'react';
import { navigate } from '@reach/router';
import { useSelector } from 'react-redux';
import { activeSlideSelector, slidesSelector } from '../slices/deck-slice';

export const usePreviewWindow = () => {
  const slideJson = useSelector(slidesSelector);
  const activeSlideJson = useSelector(activeSlideSelector);

  const handleOpenPreviewWindow = useCallback(async () => {
    const index = slideJson.indexOf(activeSlideJson);
    await navigate(`/preview-deck?slideIndex=${0}&stepIndex=0`);
  }, [activeSlideJson, slideJson]);

  return { handleOpenPreviewWindow };
};
