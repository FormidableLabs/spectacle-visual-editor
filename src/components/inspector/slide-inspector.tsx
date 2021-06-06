import React, { useCallback } from 'react';
import { Pane } from './inspector-styles';
import { useDispatch, useSelector } from 'react-redux';
import { deckSlice, activeSlideSelector } from '../../slices/deck-slice';
import { Accordion } from '../user-interface/accordion';
import { MdInput } from '../inputs/md';

export const SlideInspector = () => {
  const dispatch = useDispatch();

  const activeSlide = useSelector(activeSlideSelector);

  const handleElementChanged = useCallback(
    (value) =>
      dispatch(deckSlice.actions.addOrEditNotesToActiveSlide({ value })),
    [dispatch]
  );

  const notes = activeSlide?.children.find(
    (child) => child.component === 'Notes'
  )?.children;

  return (
    <Pane padding={10}>
      <Accordion label="Slide notes">
        <MdInput
          label="Notes"
          value={String(!!notes ? notes : '')}
          onValueChange={handleElementChanged}
        />
      </Accordion>
    </Pane>
  );
};
