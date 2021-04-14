import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { deckSlice } from '../../slices/deck-slice';
import { Pane } from './inspector-styles';
import { basicLayout, codePaneLayout } from '../../templates/basic-layouts';
import { Slide } from '../slide/slide';
import { SlideViewerWrapper } from '../slide/slide-viewer/slide-viewer-wrapper';
import { generateInternalSlideTree } from '../slide/slide-generator';
import { DeckElement, DeckSlide } from '../../types/deck-elements';

const layouts: { [key: string]: () => DeckElement[] } = {
  basicLayout,
  codePaneLayout
};

export const LayoutInspector = () => {
  const dispatch = useDispatch();
  return (
    <Pane>
      <SlideViewerWrapper>
        {Object.keys(layouts).map((layoutKey) => (
          <Slide
            key={`${layoutKey}-key`}
            id={`${layoutKey}-template`}
            scale={0.2}
            slideProps={{
              containerStyle: {},
              onSlideClick() {
                dispatch(
                  deckSlice.actions.applyLayoutToSlide(layouts[layoutKey]())
                );
              }
            }}
          >
            {(layouts[layoutKey]() as DeckSlide[]).map(
              generateInternalSlideTree as (
                opt: DeckSlide
              ) => React.ReactElement
            )}
          </Slide>
        ))}
      </SlideViewerWrapper>
    </Pane>
  );
};
