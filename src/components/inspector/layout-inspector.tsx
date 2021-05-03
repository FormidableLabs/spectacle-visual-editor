import React, { useMemo, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { deckSlice, activeSlideSelector } from '../../slices/deck-slice';
import { Pane } from './inspector-styles';
import { basicLayout, codePaneLayout } from '../../templates/basic-layouts';
import { Slide } from '../slide/slide';
import { SlideViewerWrapper } from '../slide/slide-viewer/slide-viewer-wrapper';
import { generateInternalSlideTree } from '../slide/slide-generator';
import {
  DeckElement,
  DeckElementMap,
  DeckSlide
} from '../../types/deck-elements';
import { constructDeckElements } from '../../util/construct-deck-elements';
import { useSelector } from 'react-redux';
import { Dialog } from 'evergreen-ui';
import { useToggle } from '../../hooks/use-toggle';

type Layouts = {
  [key: string]: () => { elementIds: string[]; elementMap: DeckElementMap };
};

const layouts: Layouts = {
  basicLayout,
  codePaneLayout
};

const SlideWrapper = styled.div`
  overflow: hidden;
  margin: 10px 0;
  display: flex;
  justify-content: center;
`;

export const LayoutInspector = () => {
  const dispatch = useDispatch();
  const [selectedLayoutKey, setSelectedLayoutKey] = useState('');
  const activeSlide = useSelector(activeSlideSelector);
  const [dialogOpen, toggleDialog] = useToggle();

  const hasExisitingContent = useMemo(() => {
    if (activeSlide?.children && activeSlide.children.length > 0) {
      return true;
    }
    return false;
  }, [activeSlide]);

  const applySelectedLayout = useCallback(
    (closeDialog?: () => void) => {
      dispatch(
        deckSlice.actions.applyLayoutToSlide(layouts[selectedLayoutKey]())
      );
      // closeDialog is an argument from Dialog's onConfirm
      closeDialog?.();
    },
    [dispatch, selectedLayoutKey]
  );

  useEffect(() => {
    if (selectedLayoutKey.length && !hasExisitingContent) {
      // This runs when there are no activeSlide.children so no
      // dialog is needed.
      applySelectedLayout();
    }
  }, [applySelectedLayout, hasExisitingContent, selectedLayoutKey]);

  const handleSlideClick = useCallback(
    (layoutKey: string) => {
      // Removes template portion of id
      const newLayoutKey = layoutKey.split('-template')[0];
      setSelectedLayoutKey(newLayoutKey);
      if (hasExisitingContent) {
        toggleDialog();
      }
    },
    [hasExisitingContent, toggleDialog]
  );

  const slideProps = useMemo(
    () => ({ containerStyle: {}, onSlideClick: handleSlideClick }),
    [handleSlideClick]
  );

  const constructedLayouts: {
    [key: string]: DeckElement[];
  } = React.useMemo(() => {
    return Object.keys(layouts).reduce((accum, layoutKey) => {
      const { elementIds, elementMap } = layouts[layoutKey]();
      const getElementById = (id: string) => elementMap[id];

      return {
        ...accum,
        [layoutKey]: constructDeckElements(elementIds, getElementById)
      };
    }, {});
  }, []);

  return (
    <Pane>
      <Dialog
        isShown={dialogOpen}
        intent="danger"
        hasHeader={false}
        onCloseComplete={toggleDialog}
        onConfirm={applySelectedLayout}
        confirmLabel="Apply Layout"
      >
        Applying a layout to a non-empty slide will replace its content. Do you
        wish to continue?
      </Dialog>
      <SlideViewerWrapper>
        {Object.keys(layouts).map((layoutKey) => (
          <SlideWrapper key={`${layoutKey}-key`}>
            <Slide
              id={`${layoutKey}-template`}
              scale={0.18}
              slideProps={slideProps}
            >
              {(constructedLayouts[layoutKey] as DeckSlide[]).map(
                generateInternalSlideTree as (
                  opt: DeckSlide
                ) => React.ReactElement
              )}
            </Slide>
          </SlideWrapper>
        ))}
      </SlideViewerWrapper>
    </Pane>
  );
};
