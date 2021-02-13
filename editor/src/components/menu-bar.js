import React from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { Button, Menu, Popover, Position } from 'evergreen-ui';
import { SpectacleLogo } from './logo';
import { useDispatch } from 'react-redux';
import { deckSlice } from '../slices/deck-slice';
import { usePreviewWindow } from '../hooks';

const MenuBarContainer = styled.div`
  width: 100%;
  background: #e5e0df;
  border-bottom: #cac5c4 1px solid;
  display: flex;
  align-items: center;
`;

const LogoContainer = styled.div`
  margin: 0 2px 0 16px;
`;

export const MenuBar = () => {
  const dispatch = useDispatch();
  const { handleOpenPreviewWindow } = usePreviewWindow();

  return (
    <MenuBarContainer>
      <LogoContainer>
        <SpectacleLogo size={32} />
      </LogoContainer>
      <Popover
        position={Position.BOTTOM_LEFT}
        content={({ close }) => (
          <Menu>
            <Menu.Group>
              <Menu.Item
                onSelect={() => {
                  dispatch(deckSlice.actions.newSlideAdded());
                  close();
                }}
              >
                Add Slide
              </Menu.Item>
            </Menu.Group>
            <Menu.Divider />
            <Menu.Group>
              <Menu.Item onSelect={() => {}} secondaryText="⌘S">
                Save
              </Menu.Item>
              <Menu.Item
                onSelect={() => {
                  handleOpenPreviewWindow();
                  close();
                }}
              >
                Preview Deck...
              </Menu.Item>
            </Menu.Group>
          </Menu>
        )}
      >
        <Button appearance="minimal">File</Button>
      </Popover>
      <Popover
        position={Position.BOTTOM_LEFT}
        content={({ close }) => (
          <Menu>
            <Menu.Group>
              <Menu.Item onSelect={() => {}}>Heading</Menu.Item>
              <Menu.Item
                onSelect={() => {
                  dispatch(
                    deckSlice.actions.elementAddedToActiveSlide({
                      id: v4(),
                      component: 'Heading',
                      children: 'Oh Hello There'
                    })
                  );
                  close();
                }}
              >
                Text Box
              </Menu.Item>
              <Menu.Item onSelect={() => {}}>Image</Menu.Item>
              <Menu.Item onSelect={() => {}}>List</Menu.Item>
              <Menu.Item onSelect={() => {}}>Code Pane</Menu.Item>
            </Menu.Group>
            <Menu.Divider />
            <Menu.Group>
              <Menu.Item onSelect={() => {}}>Box</Menu.Item>
              <Menu.Item onSelect={() => {}}>Horizontal Layout</Menu.Item>
              <Menu.Item onSelect={() => {}}>Vertical Layout</Menu.Item>
              <Menu.Item onSelect={() => {}}>Grid</Menu.Item>
            </Menu.Group>
          </Menu>
        )}
      >
        <Button appearance="minimal">Insert</Button>
      </Popover>
    </MenuBarContainer>
  );
};
