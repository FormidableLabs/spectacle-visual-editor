import { useCallback } from 'react';
import { navigate } from '@reach/router';

export const usePreviewWindow = () => {
  const handleOpenPreviewWindow = useCallback(async () => {
    await navigate(`/preview-deck?slideIndex=${0}&stepIndex=0`);
  }, []);

  return { handleOpenPreviewWindow };
};
