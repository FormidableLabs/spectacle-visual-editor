import { useCallback } from 'react';

export const useStoredPaneSize = (
  localStorageKey: string,
  defaultInitialSize: string | number
) => {
  const storedPaneSize = localStorage.getItem(localStorageKey);
  const initialSize = Number(storedPaneSize) || defaultInitialSize;

  const onResize = useCallback(
    (size: number) => {
      localStorage.setItem(localStorageKey, String(size));
    },
    [localStorageKey]
  );

  return { initialSize, onResize };
};
