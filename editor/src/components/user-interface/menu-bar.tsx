import React from 'react';
import styled from 'styled-components';
import { Button, defaultTheme, Menu, Popover, Position } from 'evergreen-ui';
import { SpectacleLogo } from './logo';
import { useDispatch } from 'react-redux';
import { deckSlice } from '../../slices/deck-slice';
import { usePreviewWindow } from '../../hooks';
import { ELEMENTS } from '../slide/elements';

const MenuBarContainer = styled.div`
  width: 100%;
  background: ${defaultTheme.scales.neutral.N3};
  border-bottom: ${defaultTheme.scales.neutral.N6} 1px solid;
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
              <Menu.Item
                onSelect={() => {
                  dispatch(deckSlice.actions.deleteSlide(null));
                  close();
                }}
              >
                Delete Slide
              </Menu.Item>
            </Menu.Group>
            <Menu.Divider />
            <Menu.Group>
              <Menu.Item onSelect={() => {}} secondaryText={<span>⌘S</span>}>
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
              <Menu.Item
                onSelect={() => {
                  dispatch(
                    deckSlice.actions.elementAddedToActiveSlide(
                      ELEMENTS.HEADING
                    )
                  );
                  close();
                }}
              >
                Heading
              </Menu.Item>
              <Menu.Item
                onSelect={() => {
                  dispatch(
                    deckSlice.actions.elementAddedToActiveSlide(ELEMENTS.TEXT)
                  );
                  close();
                }}
              >
                Text Box
              </Menu.Item>
              <Menu.Item onSelect={() => {}}>Image</Menu.Item>
              <Menu.Item
                onSelect={() => {
                  dispatch(
                    deckSlice.actions.elementAddedToActiveSlide(ELEMENTS.LIST)
                  );
                  close();
                }}
              >
                List
              </Menu.Item>
              <Menu.Item onSelect={() => {}}>Code Pane</Menu.Item>
              <Menu.Item
                onSelect={() => {
                  dispatch(
                    deckSlice.actions.elementAddedToActiveSlide(ELEMENTS.BOX)
                  );
                  close();
                }}
              >
                Box
              </Menu.Item>
            </Menu.Group>
          </Menu>
        )}
      >
        <Button appearance="minimal">Insert</Button>
      </Popover>
    </MenuBarContainer>
  );
};
