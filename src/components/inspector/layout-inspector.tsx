import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { deckSlice } from '../../slices/deck-slice';
import { Pane } from './inspector-styles';
import { basicLayout, codePaneLayout } from '../../templates/basic-layouts';
import { Slide } from '../slide/slide';
import { SlideViewerWrapper } from '../slide/slide-viewer/slide-viewer-wrapper';
import { generateInternalSlideTree } from '../slide/slide-generator';
import { DeckElement2, DeckElementMap2, DeckSlide2 } from '../../types/deck-elements';
import { constructElements } from '../../util/construct-elements';

type Layouts = {
  [key: string]: () => { elementIds: string[]; elementMap: DeckElementMap2; }
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

  const constructedLayouts: { [key: string]: DeckElement2[]; } = React.useMemo(() => {
    return Object.keys(layouts).reduce((accum, layoutKey) => {
      const { elementIds, elementMap } = layouts[layoutKey]();
      const getElementById = (id: string) => elementMap[id];

      return {
        ...accum,
        [layoutKey]: constructElements(elementIds, getElementById)
      };
    }, {});
  }, []);

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
              {(constructedLayouts[layoutKey] as DeckSlide2[]).map(
                generateInternalSlideTree as (
                  opt: DeckSlide2
                ) => React.ReactElement
              )}
            </Slide>
          </SlideWrapper>
        ))}
      </SlideViewerWrapper>
    </Pane>
  );
};
