import React, { useCallback } from 'react';
import { Pane } from './inspector-styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  deckSlice,
  activeSlideSelector,
  themeSelector
} from '../../slices/deck-slice';
import { Accordion } from '../user-interface/accordion';
import { MdInput } from '../inputs/md';
import { ColorPickerInput } from '../inputs/color';
import { useRootSelector } from '../../store';
import { Button } from 'evergreen-ui';

export const SlideInspector = () => {
  const dispatch = useDispatch();

  const themeValues = useRootSelector(themeSelector);
  const activeSlide = useSelector(activeSlideSelector);

  const handleElementChanged = useCallback(
    (value) =>
      dispatch(deckSlice.actions.addOrEditNotesToActiveSlide({ value })),
    [dispatch]
  );
  const [inputState, setInputState] = React.useState(
    themeValues.colors.tertiary
  );

  const notes = activeSlide?.children.find(
    (child) => child.component === 'Notes'
  )?.children;

  const customBackgroundColor = activeSlide?.props?.backgroundColor as
    | string
    | undefined;

  return (
    <Pane padding={10}>
      <Accordion label="Slide notes">
        <MdInput
          label="Notes"
          value={String(!!notes ? notes : '')}
          onValueChange={handleElementChanged}
        />
      </Accordion>
      <Accordion label="Background color">
        {!!customBackgroundColor && <Button>Use theme background</Button>}
        <ColorPickerInput
          onChangeInput={setInputState}
          key={`bg-color-value`}
          label={`Slide background`}
          onUpdateValue={(value) =>
            dispatch(
              deckSlice.actions.editActiveSlide({
                props: {
                  backgroundColor: value
                }
              })
            )
          }
          validValue={themeValues.colors.tertiary}
          value={inputState}
        />
      </Accordion>
    </Pane>
  );
};
