import React, { useEffect, useState } from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import { Deck } from 'spectacle';
import { generatePreviewSlideTree } from './slide-generator';
import { useSelector } from 'react-redux';
import {
  slidesSelector,
  themeSelector,
  constructedSlideTemplateSelector
} from '../../slices/deck-slice';
import { useRootSelector } from '../../store';
import { ConstructedDeckSlide } from '../../types/deck-elements';
import { toaster } from 'evergreen-ui';
import { PATHS } from '../../constants/paths';

export const PreviewDeck: React.FC<RouteComponentProps> = () => {
  const [slideNodes, setSlideNodes] = useState<React.ReactNode>();
  const slideJson = useRootSelector(slidesSelector);
  const [slideTemplateNode, setSlideTemplateNode] = useState<React.ReactNode>();
  const slideTemplateJson = useRootSelector(constructedSlideTemplateSelector);
  const theme = useSelector(themeSelector);

  useEffect(() => {
    try {
      const slideTree = slideJson.map(
        generatePreviewSlideTree as (
          opt: ConstructedDeckSlide
        ) => React.ReactElement
      );
      setSlideNodes(slideTree);
    } catch (e) {}
  }, [slideJson]);

  useEffect(() => {
    try {
      if (!slideTemplateJson) {
        return;
      }

      // Slide component non-nestable, adjust as div
      const adjusted = {
        ...slideTemplateJson,
        component: 'div',
        props: {
          style: {
            border: '1px solid green',
            height: '100%',
            width: '100%',
            position: 'relative'
          }
        }
      };

      // TODO: refine type of outer element
      const node = (generatePreviewSlideTree as (
        opt: ConstructedDeckSlide
      ) => React.ReactElement)(adjusted);

      setSlideTemplateNode(node);
    } catch (e) {}
  }, [slideTemplateJson]);

  useEffect(() => {
    toaster.notify('Press Esc to quit the presentation preview.', {
      duration: 3
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.code.toLowerCase() === 'escape') {
        await navigate(PATHS.VISUAL_EDITOR);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      {slideNodes ? (
        <Deck theme={theme} template={slideTemplateNode}>
          {slideNodes}
        </Deck>
      ) : null}
    </div>
  );
};
