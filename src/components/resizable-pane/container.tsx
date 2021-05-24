import React, {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import styled from 'styled-components';
import { Orientation, Flex, Pane } from './';
import ResizablePaneContext from './context';

const getElementSize = (
  element: HTMLDivElement,
  orientation: Orientation
): number =>
  orientation === 'horizontal' ? element.offsetWidth : element.offsetHeight;

interface ResizablePaneContainerProps {
  orientation: Orientation;
}

const Container = styled.div<{ orientation: Orientation }>`
  flex: 1;
  display: flex;
  flex-direction: ${(props) =>
    props.orientation === 'horizontal' ? 'row' : 'column'};
  overflow: hidden;
`;

const ResizablePaneContainer: FC<ResizablePaneContainerProps> = ({
  orientation,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [flex, setFlex] = useState<Flex>({});
  const [panes, setPanes] = useState<Array<Pane>>([]);
  const [splitter, setSplitter] = useState<HTMLDivElement | null>(null);

  const initPane = useCallback((pane: Pane) => {
    setPanes((currentPanes) => [...currentPanes, pane]);
  }, []);

  const isPaneMinSize = useCallback(
    (pane: HTMLDivElement, orientation: Orientation): boolean => {
      const paneProperties = panes.find((p) => p.id === pane.dataset.pane);
      return getElementSize(pane, orientation) === paneProperties?.minSize;
    },
    [panes]
  );

  const isPaneMaxSize = useCallback(
    (pane: HTMLDivElement, orientation: Orientation): boolean => {
      const paneProperties = panes.find((p) => p.id === pane.dataset.pane);
      return getElementSize(pane, orientation) === paneProperties?.maxSize;
    },
    [panes]
  );

  const getResizingPane = useCallback(
    (isPositiveOffset: boolean, previous: boolean): HTMLDivElement | null => {
      if (!splitter) {
        return null;
      }

      let sibling = (previous
        ? splitter.previousElementSibling
        : splitter.nextElementSibling) as HTMLDivElement;

      const isGrowing = previous ? !isPositiveOffset : isPositiveOffset;

      // Loop over the splitter’s siblings to find the first pane that can be resized
      while (sibling) {
        const isResizable = sibling.matches('[data-pane]');
        const isMinSize = isPaneMinSize(sibling, orientation);
        const isMaxSize = isPaneMaxSize(sibling, orientation);

        if (
          isResizable &&
          ((isGrowing && !isMaxSize) || (!isGrowing && !isMinSize))
        ) {
          return sibling;
        }

        sibling = (previous
          ? sibling.previousElementSibling
          : sibling.nextElementSibling) as HTMLDivElement;
      }

      return sibling;
    },
    [orientation, splitter, isPaneMinSize, isPaneMaxSize]
  );

  // TODO: fix use of any
  const handleResize = useCallback(
    (e: any) => {
      if (!splitter || !containerRef.current) {
        return;
      }

      const splitterPosition =
        orientation === 'horizontal' ? splitter.offsetLeft : splitter.offsetTop;
      const distanceFromSplitter =
        orientation === 'horizontal' ? e.clientX : e.clientY;
      const containerSize = getElementSize(containerRef.current, orientation);
      const offsetDifference =
        (splitterPosition - distanceFromSplitter) / containerSize;

      if (!offsetDifference) {
        return;
      }

      const isPositiveOffset = Math.sign(offsetDifference) === 1;
      const prevPane = getResizingPane(isPositiveOffset, true);
      const nextPane = getResizingPane(isPositiveOffset, false);

      if (!prevPane || !nextPane) {
        return;
      }

      setFlex((currentFlex) => {
        const prevPaneKey = String(prevPane.dataset.pane);
        const nextPaneKey = String(nextPane.dataset.pane);

        return {
          ...currentFlex,
          [prevPaneKey]: currentFlex[prevPaneKey] - offsetDifference,
          [nextPaneKey]: currentFlex[nextPaneKey] + offsetDifference
        };
      });
    },
    [orientation, splitter, getResizingPane]
  );

  const handleResizeStart: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const newSplitter = e.target as HTMLDivElement;

      if (newSplitter) {
        document.body.classList.add(
          'is-resizing',
          `is-resizing-${orientation}`
        );

        setSplitter(newSplitter);
      }
    },
    [orientation]
  );

  const handleResizeEnd = useCallback(() => {
    document.body.classList.remove('is-resizing', `is-resizing-${orientation}`);
    setSplitter(null);
  }, [orientation]);

  // Add resize event listeners when mousedown begins on a splitter
  useEffect(() => {
    if (splitter) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [handleResize, handleResizeEnd, splitter]);

  // Set initial pane size
  useLayoutEffect(() => {
    if (containerRef.current) {
      const newFlex: Flex = {};
      const containerSize = getElementSize(containerRef.current, orientation);
      const unsizedPanes: Array<Pane> = [];
      let remainingFlex = 1;

      panes.forEach((pane) => {
        if (pane.initialFlex) {
          newFlex[pane.id] = pane.initialFlex;
        } else if (pane.initialSize) {
          const sizeAsFlex = pane.initialSize / containerSize;
          newFlex[pane.id] = sizeAsFlex;
          remainingFlex -= sizeAsFlex;
        } else {
          unsizedPanes.push(pane);
        }
      });

      // All panes without an initial flex/size get set with equal flex
      unsizedPanes.forEach((pane) => {
        newFlex[pane.id] = remainingFlex / unsizedPanes.length;
      });

      setFlex(newFlex);
    }
  }, [panes, orientation]);

  const contextValue = useMemo(
    () => ({
      flex,
      orientation,
      initPane,
      handleResizeStart
    }),
    [flex, orientation, initPane, handleResizeStart]
  );

  return (
    <Container ref={containerRef} orientation={orientation}>
      <ResizablePaneContext.Provider value={contextValue}>
        {children}
      </ResizablePaneContext.Provider>
    </Container>
  );
};

export default ResizablePaneContainer;
