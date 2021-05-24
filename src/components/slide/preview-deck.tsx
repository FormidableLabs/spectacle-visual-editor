import React, { useEffect, useState } from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import { Deck } from 'spectacle';
import { generatePreviewSlideTree } from './slide-generator';
import { useSelector } from 'react-redux';
import { slidesSelector, themeSelector } from '../../slices/deck-slice';
import { useRootSelector } from '../../store';
import { ConstructedDeckSlide } from '../../types/deck-elements';
import { toaster } from 'evergreen-ui';

export const PreviewDeck: React.FC<RouteComponentProps> = () => {
  const [slideNodes, setSlideNodes] = useState<React.ReactNode>();
  const slideJson = useRootSelector(slidesSelector);
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
    toaster.notify('Press Esc to quit the presentation preview.', {
      duration: 3
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.code.toLowerCase() === 'escape') {
        await navigate('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>{slideNodes ? <Deck theme={theme}>{slideNodes}</Deck> : null}</div>
  );
};
