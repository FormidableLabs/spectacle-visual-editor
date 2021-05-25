import { defaultTheme } from 'evergreen-ui';
import React, {
  createRef,
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react';
import styled from 'styled-components';

type Orientation = 'horizontal' | 'vertical';

type FixedSizeArray<N extends number, T> = N extends 0
  ? never[]
  : {
      0: T;
      length: N;
    } & ReadonlyArray<T>;

interface ResizablePanesProps {
  children: FixedSizeArray<2, ReactElement>;
  initialSize: number | string;
  minSize: number;
  orientation: Orientation;
}

const Container = styled.div<{ isHorizontal: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isHorizontal ? 'row' : 'column')};
  flex: 1;
  overflow: hidden;
`;

const Pane = styled.div<{ isFlexible?: boolean }>`
  display: flex;
  overflow: auto;
  ${({ isFlexible }) => isFlexible && 'flex: 1;'}
`;

const Splitter = styled.div<{ isHorizontal: boolean; isDragging: boolean }>`
  position: relative;
  flex-shrink: 0;
  width: ${(props) => (props.isHorizontal ? '1px' : '100%')};
  height: ${(props) => (props.isHorizontal ? '100%' : '1px')};
  background: ${defaultTheme.scales.neutral.N6};
  cursor: ${(props) => (props.isHorizontal ? 'col-resize' : 'row-resize')};
  &::after {
    content: '';
    position: absolute;
    z-index: 1000;
    width: ${(props) => (props.isHorizontal ? '5px' : '100%')};
    height: ${(props) => (props.isHorizontal ? '100%' : '5px')};
    background: ${defaultTheme.palette.blue.base};
    transform: ${(props) =>
      props.isHorizontal ? 'translateX(-2px)' : 'translateY(-2px)'};
    opacity: ${(props) => (props.isDragging ? 1 : 0)};
  }
  &:hover::after {
    opacity: 1;
  }
`;

export const ResizablePanes: FC<ResizablePanesProps> = ({
  orientation,
  initialSize,
  minSize,
  children
}) => {
  const [paneSize, setPaneSize] = useState(initialSize);
  const [splitterPosition, setSplitterPosition] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const isHorizontal = orientation === 'horizontal';

  const paneRef = createRef<HTMLDivElement>();
  const container = createRef<HTMLDivElement>();

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setSplitterPosition(isHorizontal ? e.clientX : e.clientY);
      setDragging(true);
    },
    [isHorizontal]
  );

  const onMove = useCallback(
    (pointerPosition: number) => {
      if (isDragging && paneSize && splitterPosition) {
        const newPaneSize =
          (paneSize as number) - pointerPosition + splitterPosition;

        if (newPaneSize <= minSize) {
          setPaneSize(minSize);
          return;
        }

        if (container.current) {
          const containerSize = isHorizontal
            ? container.current.clientWidth
            : container.current.clientHeight;

          if (newPaneSize > containerSize - minSize) {
            setPaneSize(containerSize - minSize);
            return;
          }
        }

        setSplitterPosition(pointerPosition);
        setPaneSize(newPaneSize);
      }
    },
    [isHorizontal, isDragging, paneSize, splitterPosition, container, minSize]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      onMove(isHorizontal ? e.clientX : e.clientY);
    },
    [isHorizontal, onMove]
  );

  const onMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  // Convert percentage values to pixels on initial load
  useLayoutEffect(() => {
    if (paneRef.current && typeof paneSize === 'string') {
      setPaneSize(
        isHorizontal
          ? paneRef.current.offsetWidth
          : paneRef.current.offsetHeight
      );
    }
  }, [paneSize, paneRef, isHorizontal]);

  useEffect(() => {
    if (isDragging) {
      document.body.classList.add('is-resizing', `is-resizing-${orientation}`);
    } else {
      document.body.classList.remove(
        'is-resizing',
        `is-resizing-${orientation}`
      );
    }
  }, [isDragging, orientation]);

  const firstPaneStyle = useMemo(() => {
    if (isHorizontal) {
      return { minWidth: minSize };
    } else {
      return { minHeight: minSize };
    }
  }, [isHorizontal, minSize]);

  const secondPaneStyle = useMemo(() => {
    if (isHorizontal) {
      return { width: paneSize, minWidth: minSize };
    } else {
      return { height: paneSize, minHeight: minSize };
    }
  }, [isHorizontal, paneSize, minSize]);

  return (
    <Container ref={container} isHorizontal={isHorizontal}>
      <Pane style={firstPaneStyle} isFlexible>
        {children[0]}
      </Pane>
      <Splitter
        isHorizontal={isHorizontal}
        isDragging={isDragging}
        onMouseDown={onMouseDown}
      />
      <Pane ref={paneRef} style={secondPaneStyle}>
        {children[1]}
      </Pane>
    </Container>
  );
};

export default ResizablePanes;
