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

const SlideWrapper = styled.div`
  overflow: hidden;
  margin: 10px 0;
  display: flex;
  justify-content: center;
`;

export const LayoutInspector = () => {
  const dispatch = useDispatch();
  return (
    <Pane>
      <SlideViewerWrapper>
        {Object.keys(layouts).map((layoutKey) => (
          <SlideWrapper key={`${layoutKey}-key`}>
            <Slide
              id={`${layoutKey}-template`}
              scale={0.18}
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
          </SlideWrapper>
        ))}
      </SlideViewerWrapper>
    </Pane>
  );
};
