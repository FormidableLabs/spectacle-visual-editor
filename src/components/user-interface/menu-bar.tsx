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
                  dispatch(deckSlice.actions.deleteSlide());
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
              {InsertItems.map((item) => (
                <Menu.Item
                  key={item.title}
                  onSelect={() => {
                    dispatch(
                      deckSlice.actions.elementAddedToActiveSlide(item.element)
                    );
                    close();
                  }}
                >
                  {item.title}
                </Menu.Item>
              ))}
            </Menu.Group>
          </Menu>
        )}
      >
        <Button appearance="minimal">Insert</Button>
      </Popover>
      <Popover
        position={Position.BOTTOM_LEFT}
        content={({ close }) => (
          <Menu>
            <Menu.Group>
              <Menu.Item secondaryText={<span>⌘Z</span>}>Undo</Menu.Item>
              <Menu.Item secondaryText={<span>⇧⌘Z</span>}>Redo</Menu.Item>
            </Menu.Group>
            <Menu.Group>
              <Menu.Item secondaryText={<span>⌘X</span>}>Cut</Menu.Item>
              <Menu.Item secondaryText={<span>⌘C</span>}>Copy</Menu.Item>
              <Menu.Item secondaryText={<span>⌘V</span>}>Paste</Menu.Item>
            </Menu.Group>
            <Menu.Group>
              <Menu.Item secondaryText={<span>⌘D</span>}>Delete</Menu.Item>
            </Menu.Group>
          </Menu>
        )}
      >
        <Button appearance="minimal">Edit</Button>
      </Popover>
    </MenuBarContainer>
  );
};

const InsertItems: { title: string; element: typeof ELEMENTS[number] }[] = [
  { title: 'Heading', element: ELEMENTS.HEADING },
  { title: 'Text Box', element: ELEMENTS.TEXT },
  { title: 'List', element: ELEMENTS.LIST },
  { title: 'Box', element: ELEMENTS.BOX },
  { title: 'Image', element: ELEMENTS.IMAGE }
];
