import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Deck } from 'spectacle';
import { generatePreviewSlideTree } from './slide-generator';
import { useSelector } from 'react-redux';
import {
  slidesSelector,
  themeSelector,
  constructedSlideTemplateSelector
} from '../../slices/deck-slice';
import { useRootSelector } from '../../store';
import {
  ConstructedDeckSlide,
  ConstructedDeckSlideTemplate
} from '../../types/deck-elements';
import { PATHS } from '../../constants/paths';

export const PreviewDeck: React.FC = () => {
  const [slideNodes, setSlideNodes] = useState<React.ReactNode>();
  const slideJson = useRootSelector(slidesSelector);
  const [slideTemplateNode, setSlideTemplateNode] = useState<React.ReactNode>();
  const slideTemplateJson = useRootSelector(constructedSlideTemplateSelector);
  const theme = useSelector(themeSelector);
  const navigate = useNavigate();
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
      const adjusted: ConstructedDeckSlideTemplate = {
        ...slideTemplateJson,
        component: 'div',
        props: {
          style: {
            height: '100%',
            position: 'relative',
            width: '100%'
          }
        }
      };

      const node = (
        generatePreviewSlideTree as (
          opt: ConstructedDeckSlideTemplate
        ) => React.ReactElement
      )(adjusted);

      setSlideTemplateNode(node);
    } catch (e) {}
  }, [slideTemplateJson]);

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
  }, [navigate]);

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
