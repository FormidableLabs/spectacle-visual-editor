import { useEffect, useState, useRef, useCallback, RefObject } from 'react';
import { useSelector } from 'react-redux';
import { themeSelector } from '../slices/deck-slice';
import { settingsSelector } from '../slices/settings-slice';
import { SpectacleTheme } from '../types/theme';

function getScale(
  canvasEl: HTMLDivElement,
  size: SpectacleTheme['size'],
  scaleSetting: string
) {
  if (scaleSetting !== 'fit') return Number(scaleSetting);

  // We use the parent element here as a stable reference for the
  // constrained area we have to show the canvas element in. The canvas element
  // itself is subject to resizing, so it is not suitable.
  const { offsetWidth, offsetHeight } = canvasEl.parentElement as HTMLElement;
  const { width, height } = size;

  const scale = Math.min(offsetWidth / width, offsetHeight / height);

  return scale;
}

/**
 * Returns a scale that can be applied to fit slide within a container
 */
export const useSlideScale = (canvasElRef: RefObject<HTMLDivElement>) => {
  const { scale: scaleSetting } = useSelector(settingsSelector);
  const theme = useSelector(themeSelector);
  const [scale, setScale] = useState(0);
  const rAF = useRef<number | undefined>();

  // Update scale
  const resizeCallback = useCallback(() => {
    if (!canvasElRef.current) return;

    const scale = getScale(canvasElRef.current, theme.size, scaleSetting);

    if (rAF.current) cancelAnimationFrame(rAF.current);
    rAF.current = requestAnimationFrame(() => {
      setScale(scale);
    });
  }, [canvasElRef, theme.size, scaleSetting]);

  // Set initial scale value and recompute when element size, theme.size or
  // scaleSetting changes
  useEffect(() => {
    if (!canvasElRef.current) return;

    const resizeObserver = new ResizeObserver(resizeCallback);
    resizeObserver.observe(canvasElRef.current);

    return () => resizeObserver.disconnect();
  }, [canvasElRef, resizeCallback]);

  return scale;
};
