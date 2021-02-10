import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { navigate } from '@reach/router';
import { Deck } from 'spectacle';
import { generatePreviewSlideTree } from './slide-generator';
import { useSelector } from 'react-redux';
import { slidesSelector } from '../slices/deck-slice';

const Message = styled.div`
  position: sticky;
  color: white;
  z-index: 1;
`;

export const PreviewDeck = () => {
  const [slideNodes, setSlideNodes] = useState();
  const slideJson = useSelector(slidesSelector);

  useEffect(() => {
    try {
      const slideTree = slideJson.map(generatePreviewSlideTree);
      setSlideNodes(slideTree);
    } catch (e) {}
  }, [slideJson]);

  useEffect(() => {
    const handleKeyDown = async (event) => {
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
    <div>
      <Message>Press Esc to quit the presentation preview.</Message>
      {slideNodes ? <Deck>{slideNodes}</Deck> : null}
    </div>
  );
};
