import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pane, Button } from 'evergreen-ui';
import { deckSlice, slideTemplateOpenSelector } from '../../slices/deck-slice';
import { Accordion } from '../user-interface/accordion';

export const TemplateValues = () => {
  const dispatch = useDispatch();
  const slideTemplateOpen = useSelector(slideTemplateOpenSelector);

  const toggleSlideTemplateOpen = useCallback(() => {
    dispatch(deckSlice.actions.setSlideTemplateOpen(!slideTemplateOpen));
  }, [dispatch, slideTemplateOpen]);

  return (
    <Accordion label="Template">
      <Pane>
        <Button
          marginBottom={24}
          marginTop={8}
          onClick={toggleSlideTemplateOpen}
        >
          {slideTemplateOpen
            ? 'Exit Edit Slide Template'
            : 'Edit Slide Template'}
        </Button>
      </Pane>
    </Accordion>
  );
};
