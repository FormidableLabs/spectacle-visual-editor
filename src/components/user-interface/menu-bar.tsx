import React from 'react';
import styled from 'styled-components';
import {
  Button,
  defaultTheme,
  Menu,
  Popover,
  Position,
  Pane,
  Dialog
} from 'evergreen-ui';
import { SpectacleLogo } from './logo';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import {
  deckSlice,
  hasPastSelector,
  hasFutureSelector
} from '../../slices/deck-slice';
import { settingsSelector, settingsSlice } from '../../slices/settings-slice';
import { usePreviewWindow, useToggle } from '../../hooks';
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
  const { scale } = useSelector(settingsSelector);
  const hasPast = useSelector(hasPastSelector);
  const hasFuture = useSelector(hasFutureSelector);
  const dispatch = useDispatch();
  const { handleOpenPreviewWindow } = usePreviewWindow();
  const [dialogOpen, toggleDialog] = useToggle();

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
              <Menu.Item
                disabled={!hasPast}
                secondaryText={<span>⌘Z</span>}
                onSelect={() => {
                  dispatch(UndoActionCreators.undo());
                  close();
                }}
              >
                Undo
              </Menu.Item>
              <Menu.Item
                disabled={!hasFuture}
                secondaryText={<span>⇧⌘Z</span>}
                onSelect={() => {
                  dispatch(UndoActionCreators.redo());
                  close();
                }}
              >
                Redo
              </Menu.Item>
            </Menu.Group>
            <Menu.Group>
              <Menu.Item secondaryText={<span>⌘X</span>}>Cut</Menu.Item>
              <Menu.Item secondaryText={<span>⌘C</span>}>Copy</Menu.Item>
              <Menu.Item secondaryText={<span>⌘V</span>}>Paste</Menu.Item>
            </Menu.Group>
            <Menu.Group>
              <Pane>
                <Dialog
                  isShown={dialogOpen}
                  intent="danger"
                  onCloseComplete={() => {
                    dispatch(deckSlice.actions.deleteElement());
                    toggleDialog();
                  }}
                  hasHeader={false}
                  confirmLabel="Delete"
                >
                  Deleting this container from the slide will also delete the
                  elements inside it. Do you wish to delete this container?
                </Dialog>
              </Pane>
              <Menu.Item
                secondaryText={<span>⌘D</span>}
                onSelect={toggleDialog}
              >
                Delete
              </Menu.Item>
            </Menu.Group>
          </Menu>
        )}
      >
        <Button appearance="minimal">Edit</Button>
      </Popover>
      <Popover
        position={Position.BOTTOM_LEFT}
        content={({ close }) => (
          <Menu>
            <Menu.OptionsGroup
              title="Zoom"
              options={[
                { label: 'To fit', value: 'fit' },
                { label: 'Actual size', value: '1' }
              ]}
              selected={scale}
              onChange={(selected) => {
                dispatch(settingsSlice.actions.updateScale(selected));
                close();
              }}
            />
          </Menu>
        )}
      >
        <Button appearance="minimal">View</Button>
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
