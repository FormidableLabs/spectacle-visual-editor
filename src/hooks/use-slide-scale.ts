import { useEffect, useState, useRef, useCallback, RefObject } from 'react';
import { useSelector } from 'react-redux';
import { themeSelector } from '../slices/deck-slice';
import { settingsSelector } from '../slices/settings-slice';
import { SpectacleTheme } from '../types/theme';

function getScale(
  element: HTMLDivElement | null,
  size: SpectacleTheme['size'],
  scaleSetting: string
) {
  if (!element) return 0;

  if (scaleSetting !== 'fit') return Number(scaleSetting);

  const { offsetWidth, offsetHeight } = element;
  const { width, height } = size;

  const scale = Math.min(offsetWidth / width, offsetHeight / height);

  return scale;
}

/**
 * Returns a scale that can be applied to fit slide within a container
 */
export const useSlideScale = (ref: RefObject<HTMLDivElement>) => {
  const { scale: scaleSetting } = useSelector(settingsSelector);
  const theme = useSelector(themeSelector);
  const [scale, setScale] = useState(0);
  const rAF = useRef<number | undefined>();

  // Update scale
  const resizeCallback = useCallback(() => {
    if (ref.current) {
      const scale = getScale(ref.current, theme.size, scaleSetting);

      if (rAF.current) cancelAnimationFrame(rAF.current);

      rAF.current = requestAnimationFrame(() => {
        setScale(scale);
      });
    }
  }, [ref, theme.size, scaleSetting]);

  // Set initial scale value and recompute when theme.size changes
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setScale(getScale(ref.current, theme.size, scaleSetting));
    });
    return () => cancelAnimationFrame(raf);
  }, [ref, theme.size, scaleSetting]);

  // Trigger resizeCallback on window resize
  useEffect(() => {
    window.addEventListener('resize', resizeCallback, { passive: true });

    return () => {
      if (rAF.current) cancelAnimationFrame(rAF.current);
      window.removeEventListener('resize', resizeCallback);
    };
  }, [resizeCallback]);

  return scale;
};
