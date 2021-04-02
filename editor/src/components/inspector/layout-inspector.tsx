import React from 'react';
import { Button, Pane } from 'evergreen-ui';
import { useDispatch } from 'react-redux';
import { deckSlice } from '../../slices/deck-slice';
import { basicLayout } from '../../templates/basic-layouts';

export const LayoutInspector = () => {
  const dispatch = useDispatch();
  return (
    <Pane>
      <Button
        onClick={() =>
          dispatch(deckSlice.actions.applyLayoutToSlide(basicLayout()))
        }
      >
        Apply Basic Layout
      </Button>
    </Pane>
  );
};
