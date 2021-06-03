import React from 'react';
import { Pane, SideSheet, Heading, Paragraph } from 'evergreen-ui';
import { useDispatch, useSelector } from 'react-redux';
import { editorSelector, editorSlice } from '../../slices/editor-slice';
import { deckSlice } from '../../slices/deck-slice';
import DeckCard from './deck-card';

const SavedDecks = () => {
  const dispatch = useDispatch();
  const { savedDecks, savedDecksIsOpen } = useSelector(editorSelector);

  return (
    <SideSheet
      position="left"
      isShown={savedDecksIsOpen}
      onCloseComplete={() =>
        dispatch(editorSlice.actions.toggleSavedDecksMenu())
      }
      containerProps={{
        display: 'flex',
        flex: '1',
        flexDirection: 'column'
      }}
    >
      {({ close }: { close: () => void }) => {
        return (
          <>
            <Pane
              zIndex={1}
              flexShrink={0}
              elevation={0}
              backgroundColor="white"
            >
              <Pane padding={16}>
                <Heading size={600}>Saved Decks</Heading>
                <Paragraph size={400} color="muted">
                  Open and manage your saved decks.
                </Paragraph>
              </Pane>
            </Pane>
            <Pane flex="1" overflowY="scroll" background="tint1" padding={16}>
              {!!savedDecks.length ? (
                savedDecks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    {...deck}
                    loadDeck={() => {
                      dispatch(deckSlice.actions.loadDeck(deck));
                      close();
                    }}
                    deleteDeck={() => {
                      dispatch(deckSlice.actions.deleteDeck(deck.id));
                      dispatch(editorSlice.actions.refetchSavedDecks());
                    }}
                  />
                ))
              ) : (
                <Paragraph size={400} color="muted">
                  No saved decks.
                </Paragraph>
              )}
            </Pane>
          </>
        );
      }}
    </SideSheet>
  );
};

export default SavedDecks;
