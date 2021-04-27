import React, { useMemo, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { deckSlice, activeSlideSelector } from '../../slices/deck-slice';
import { Pane } from './inspector-styles';
import { basicLayout, codePaneLayout } from '../../templates/basic-layouts';
import { Slide } from '../slide/slide';
import { SlideViewerWrapper } from '../slide/slide-viewer/slide-viewer-wrapper';
import { generateInternalSlideTree } from '../slide/slide-generator';
import { DeckElement, DeckSlide } from '../../types/deck-elements';
import { useSelector } from 'react-redux';
import { Dialog } from 'evergreen-ui';
import { useToggle } from '../../hooks/use-toggle';

const layouts: { [key: string]: () => DeckElement[] } = {
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
    if (activeSlide?.children.length > 0) {
      return true;
    }
    return false;
  }, [activeSlide?.children]);

  const applySelectedLayout = useCallback(
    (closeDialog = null) => {
      dispatch(
        deckSlice.actions.applyLayoutToSlide(layouts[selectedLayoutKey]())
      );
      if (closeDialog) {
        // closeDialog is an argument from Dialog's onConfirm
        closeDialog();
      }
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
    (layoutKey) => {
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
              {(layouts[layoutKey]() as DeckSlide[]).map(
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
