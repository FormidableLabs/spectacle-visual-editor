import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../constants/paths';

export const usePreviewWindow = () => {
  const navigate = useNavigate();
  const handleOpenPreviewWindow = useCallback(async () => {
    await navigate(`${PATHS.PREVIEW_DECK}?slideIndex=${0}&stepIndex=0`);
  }, [navigate]);

  return { handleOpenPreviewWindow };
};
