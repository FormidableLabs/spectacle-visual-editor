import React, { FC } from 'react';
import { formatDate } from '../../util/format-date';
import {
  Card,
  Button,
  Heading,
  Paragraph,
  Pane,
  Popover,
  Menu,
  IconButton,
  CogIcon
} from 'evergreen-ui';
import { Deck } from '../../types/deck';

const Deck: FC<Deck & { loadDeck: () => void; deleteDeck: () => void }> = ({
  title,
  createdAt,
  updatedAt,
  loadDeck,
  deleteDeck
}) => (
  <Card backgroundColor="white" elevation={0} marginBottom={12} padding={12}>
    <Heading>{title || 'Untitled Deck'}</Heading>
    <Paragraph size={400} color="muted" marginBottom={8}>
      Created on {formatDate(new Date(createdAt))} - Last edit on{' '}
      {formatDate(new Date(updatedAt))}
    </Paragraph>
    <Pane display="flex">
      <Button marginRight={4} onClick={loadDeck}>
        Open
      </Button>
      <Popover
        position="bottom-left"
        content={
          <Menu>
            <Menu.Group>
              <Menu.Item onSelect={() => {}}>Make a copy</Menu.Item>
              <Menu.Item onSelect={() => {}}>Rename</Menu.Item>
              <Menu.Item onSelect={() => {}}>Export to One Page</Menu.Item>
            </Menu.Group>
            <Menu.Divider />
            <Menu.Group>
              <Menu.Item onSelect={deleteDeck} intent="danger">
                Delete
              </Menu.Item>
            </Menu.Group>
          </Menu>
        }
      >
        <IconButton icon={CogIcon} appearance="minimal" />
      </Popover>
    </Pane>
  </Card>
);

export default Deck;
