import { useCallback } from 'react';
import { navigate } from '@reach/router';
import { PATHS } from '../constants/paths';

export const usePreviewWindow = () => {
  const handleOpenPreviewWindow = useCallback(async () => {
    await navigate(`${PATHS.PREVIEW_DECK}?slideIndex=${0}&stepIndex=0`);
  }, []);

  return { handleOpenPreviewWindow };
};
