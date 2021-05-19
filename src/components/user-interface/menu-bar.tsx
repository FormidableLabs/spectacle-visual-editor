import React from 'react';
import styled from 'styled-components';
import {
  Button,
  defaultTheme,
  Menu,
  Popover,
  Position,
  Pane,
  Dialog,
  toaster,
  Tooltip,
  IconButton,
  PlusIcon,
  FloppyDiskIcon,
  EyeOpenIcon,
  UndoIcon,
  RedoIcon,
  CutIcon,
  DuplicateIcon,
  ClipboardIcon,
  MenuIcon,
  ZoomInIcon,
  GridIcon,
  GridViewIcon,
  TrashIcon
} from 'evergreen-ui';
import { SpectacleLogo } from './logo';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import {
  deckSlice,
  hasPastSelector,
  hasFutureSelector,
  selectedElementSelector,
  slidesSelector
} from '../../slices/deck-slice';
import { settingsSelector, settingsSlice } from '../../slices/settings-slice';
import { usePreviewWindow, useToggle } from '../../hooks';
import { ELEMENTS } from '../slide/elements';
import {
  CONTAINER_ELEMENTS,
  SPECTACLE_ELEMENTS
} from '../../types/deck-elements';
import { useMousetrap } from 'spectacle';
import { KEYBOARD_SHORTCUTS } from '../../constants/keyboard-shortcuts';

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
  const selectedElement = useSelector(selectedElementSelector);
  const slides = useSelector(slidesSelector);
  const dispatch = useDispatch();
  const { handleOpenPreviewWindow } = usePreviewWindow();
  const [dialogOpen, toggleDialog] = useToggle();
  const copyElement = () => {
    dispatch(deckSlice.actions.copyElement());
    toaster.success('Element copied!');
  };

  useMousetrap(
    {
      [KEYBOARD_SHORTCUTS.COPY]: () => copyElement(),
      [KEYBOARD_SHORTCUTS.PASTE]: () =>
        dispatch(deckSlice.actions.pasteElement())
    },
    []
  );

  const shouldNestableElementsBeDisabled = (insertItem: SPECTACLE_ELEMENTS) => {
    if (selectedElement) {
      return nonNestableElements.includes(insertItem);
    } else {
      return false;
    }
  };

  return (
    <MenuBarContainer>
      <LogoContainer>
        <SpectacleLogo size={32} />
      </LogoContainer>
      <MenuSection>
        <Popover
          position={Position.BOTTOM_LEFT}
          content={({ close }) => (
            <Menu>
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
                  Present Deck
                </Menu.Item>
              </Menu.Group>
              <Menu.Divider />
              <Menu.OptionsGroup
                title="Preview Size"
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
          <StyledIconButton fill="#1070ca" icon={MenuIcon} appearance="minimal" />
        </Popover>
      </MenuSection>
      <SectionDivider />
      <MenuSection>
        <Popover
          position={Position.BOTTOM_LEFT}
          content={({ close }) => (
            <Menu>
              <Menu.Group>
                {InsertItems.map((item) => (
                  <TooltipConditionalWrapper
                    condition={shouldNestableElementsBeDisabled(
                      item.element.component
                    )}
                    key={item.title}
                    wrapper={(children) => {
                      return (
                        <Tooltip
                          content={
                            'This element can only be added to the root level of slides'
                          }
                          position={Position.RIGHT}
                        >
                          {children}
                        </Tooltip>
                      );
                    }}
                  >
                    <Menu.Item
                      key={item.title}
                      disabled={shouldNestableElementsBeDisabled(
                        item.element.component
                      )}
                      onSelect={() => {
                        dispatch(
                          deckSlice.actions.elementAddedToActiveSlide(
                            item.element
                          )
                        );
                        close();
                      }}
                    >
                      {item.title}
                    </Menu.Item>
                  </TooltipConditionalWrapper>
                ))}
              </Menu.Group>
            </Menu>
          )}
        >
          <Tooltip content="Insert">
            <StyledIconButton fill="#1070ca" icon={PlusIcon} appearance="minimal" />
          </Tooltip>
        </Popover>
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
                  disabled={slides.length === 1} // Must have at least one slide
                  onSelect={() => {
                    dispatch(deckSlice.actions.deleteSlide(null));
                    close();
                  }}
                >
                  Delete Slide
                </Menu.Item>
              </Menu.Group>
            </Menu>
          )}
        >
          <Tooltip content="Slides">
            <StyledIconButton fill="#1070ca" icon={GridViewIcon} appearance="minimal" />
          </Tooltip>
        </Popover>
      </MenuSection>
      <SectionDivider />
      <MenuSection>
        <Tooltip content="Undo ⌘Z">
          <StyledIconButton
          fill="#1070ca" 
            icon={UndoIcon}
            appearance="minimal"
            disabled={!hasPast}
            onClick={() => {
              dispatch(UndoActionCreators.undo());
            }}
          />
        </Tooltip>
        <Tooltip content="Redo ⇧⌘Z">
          <StyledIconButton
          fill="#1070ca" 
            icon={RedoIcon}
            appearance="minimal"
            disabled={!hasFuture}
            onClick={() => {
              dispatch(UndoActionCreators.redo());
            }}
          />
        </Tooltip>
        <Tooltip content="Cut ⌘X">
          <StyledIconButton
          fill="#1070ca" 
            icon={CutIcon}
            appearance="minimal"
            disabled={!selectedElement}
            onClick={() => {}}
          />
        </Tooltip>
        <Tooltip content="Copy ⌘C">
          <StyledIconButton
          fill="#1070ca" 
            icon={DuplicateIcon}
            appearance="minimal"
            disabled={!selectedElement}
            onClick={() => {
              copyElement();
            }}
          />
        </Tooltip>
        <Tooltip content="Paste ⌘P">
          <StyledIconButton
          fill="#1070ca" 
            icon={ClipboardIcon}
            appearance="minimal"
            onClick={() => {
              dispatch(deckSlice.actions.pasteElement());
            }}
          />
        </Tooltip>

        <Pane>
          <Dialog
            isShown={dialogOpen}
            intent="danger"
            onConfirm={(close) => {
              dispatch(deckSlice.actions.deleteElement());
              close();
            }}
            onCloseComplete={toggleDialog}
            hasHeader={false}
            confirmLabel="Delete"
          >
            Deleting this container from the slide will also delete the elements
            inside it. Do you wish to delete this container?
          </Dialog>
        </Pane>

        <Tooltip content="Delete ⌘D">
          <StyledIconButton
            fill="#D14343" 
            icon={TrashIcon}
            appearance="minimal"
            intent="danger"
            onClick={() => {
              if (
                selectedElement &&
                CONTAINER_ELEMENTS.includes(selectedElement.component)
              ) {
                toggleDialog();
              } else {
                dispatch(deckSlice.actions.deleteElement());
                close();
              }
            }}
          />
        </Tooltip>
      </MenuSection>
    </MenuBarContainer>
  );
};

const InsertItems: { title: string; element: typeof ELEMENTS[number] }[] = [
  { title: 'Heading', element: ELEMENTS.HEADING },
  { title: 'Text Box', element: ELEMENTS.TEXT },
  { title: 'List', element: ELEMENTS.LIST },
  { title: 'Image', element: ELEMENTS.IMAGE },
  { title: 'Box', element: ELEMENTS.BOX },
  { title: 'Grid', element: ELEMENTS.GRID },
  { title: 'CodePane', element: ELEMENTS.CODEPANE }
];

const nonNestableElements: SPECTACLE_ELEMENTS[] = [
  ELEMENTS.BOX.component,
  ELEMENTS.GRID.component
];

type TooltipConditonalWrapperProps = {
  children: React.ReactElement;
  condition: boolean;
  wrapper: (children: React.ReactElement) => JSX.Element;
};

const TooltipConditionalWrapper: React.FC<TooltipConditonalWrapperProps> = ({
  condition,
  wrapper,
  children
}) => (condition ? wrapper(children) : children);

const MenuSection = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 8px;
`;

const SectionDivider = styled.div`
  height: 65%;
  border-left: 1px solid ${defaultTheme.scales.neutral.N4A};
`;

const StyledIconButton = styled(IconButton)`
  svg {
    /* Need to override inline style */
    ${(props) => (props.disabled ? null : 'fill: ' + props.fill + '!important;')}
  }
`;
