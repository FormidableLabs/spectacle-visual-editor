import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import {
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
  UndoIcon,
  RedoIcon,
  CutIcon,
  DuplicateIcon,
  ClipboardIcon,
  GridViewIcon,
  TrashIcon,
  FloppyDiskIcon,
  ZoomInIcon,
  FullscreenIcon,
  FolderCloseIcon,
  TextInput,
  UploadIcon
} from 'evergreen-ui';
import { SpectacleLogo } from './logo';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import {
  deckSlice,
  deckSelector,
  hasPastSelector,
  hasFutureSelector,
  selectedElementSelector,
  slidesSelector,
  hasPasteElementSelector
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
import { editorSlice } from '../../slices/editor-slice';
import { useRootSelector } from '../../store';

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

function useSaveFile() {
  return React.useCallback((text: string, fileName: string) => {
    const a = document.createElement('a');

    a.setAttribute('download', fileName);

    a.setAttribute(
      'href',
      `data:text/html;charset=utf-8,${encodeURIComponent(text)}`
    );

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
  }, []);
}

export const MenuBar = () => {
  const { scale } = useSelector(settingsSelector);
  const hasPast = useSelector(hasPastSelector);
  const hasFuture = useSelector(hasFutureSelector);
  const hasPaste = useSelector(hasPasteElementSelector);
  const selectedElement = useSelector(selectedElementSelector);
  const { isSaved, id, title } = useSelector(deckSelector);
  const slides = useSelector(slidesSelector);
  const dispatch = useDispatch();
  const { handleOpenPreviewWindow } = usePreviewWindow();
  const [dialogOpen, toggleDialog] = useToggle();
  const slideJson = useRootSelector(slidesSelector);
  const copyElement = (message: string) => {
    dispatch(deckSlice.actions.copyElement());
    toaster.success(message);
  };
  useMousetrap(
    {
      [KEYBOARD_SHORTCUTS.OPEN]: (e) => {
        e?.preventDefault();
        dispatch(editorSlice.actions.toggleSavedDecksMenu());
      },
      [KEYBOARD_SHORTCUTS.SAVE]: (e) => {
        e?.preventDefault();
        dispatch(deckSlice.actions.saveDeck(id));
      },
      [KEYBOARD_SHORTCUTS.CUT]: () => {
        copyElement('Element cut!');
        dispatch(deckSlice.actions.deleteElement());
      },
      [KEYBOARD_SHORTCUTS.COPY]: () => copyElement('Element copied!'),
      [KEYBOARD_SHORTCUTS.PASTE]: () =>
        dispatch(deckSlice.actions.pasteElement()),
      [KEYBOARD_SHORTCUTS.UNDO]: () => dispatch(UndoActionCreators.undo()),
      [KEYBOARD_SHORTCUTS.REDO]: () => dispatch(UndoActionCreators.redo())
    },
    []
  );

  const saveFile = useSaveFile();

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
        <Tooltip content="Rename">
          <DeckTitle>
            <TextInput
              placeholder="Untitled Deck"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                dispatch(deckSlice.actions.setTitle(e.target.value))
              }
              width={200}
              height={28}
            />
          </DeckTitle>
        </Tooltip>
      </MenuSection>
      <SectionDivider />
      <MenuSection>
        <Tooltip content="Open ⌘O">
          <StyledIconButton
            fill={defaultTheme.colors.icon.selected}
            icon={FolderCloseIcon}
            appearance="minimal"
            onClick={() => {
              dispatch(editorSlice.actions.toggleSavedDecksMenu());
            }}
          />
        </Tooltip>
        <Tooltip content="Save ⌘S">
          <div>
            <StyledIconButton
              fill={defaultTheme.colors.icon.selected}
              icon={FloppyDiskIcon}
              appearance="minimal"
              disabled={isSaved}
              onClick={() => dispatch(deckSlice.actions.saveDeck(id))}
            />
          </div>
        </Tooltip>
      </MenuSection>
      <MenuSection>
        <Tooltip content="Generate an html file from your deck">
          <div>
            <StyledIconButton
              fill="#1070ca"
              icon={UploadIcon}
              appearance="minimal"
              disabled={!slides.length}
              onClick={async () => {
                try {
                  const stringifiedSlideJson = JSON.stringify(slideJson);

                  const response = await fetch('.netlify/functions/one-page', {
                    method: 'post',
                    body: stringifiedSlideJson
                  });

                  if (response.status !== 200) {
                    throw response.statusText || 'Something went wrong.';
                  }

                  const html = await response.text();

                  saveFile(html, 'deck.html');
                } catch {
                  toaster.danger(
                    'Something went wrong while trying to export your deck.'
                  );
                }
              }}
            />
          </div>
        </Tooltip>
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
            <StyledIconButton
              fill={defaultTheme.colors.icon.selected}
              icon={PlusIcon}
              appearance="minimal"
            />
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
            <StyledIconButton
              fill={defaultTheme.colors.icon.selected}
              icon={GridViewIcon}
              appearance="minimal"
            />
          </Tooltip>
        </Popover>
      </MenuSection>
      <SectionDivider />
      <MenuSection>
        <Tooltip content="Undo ⌘Z">
          <div>
            <StyledIconButton
              fill={defaultTheme.colors.icon.selected}
              icon={UndoIcon}
              appearance="minimal"
              disabled={!hasPast}
              onClick={() => {
                dispatch(UndoActionCreators.undo());
              }}
            />
          </div>
        </Tooltip>
        <Tooltip content="Redo ⇧⌘Z">
          <div>
            <StyledIconButton
              fill={defaultTheme.colors.icon.selected}
              icon={RedoIcon}
              appearance="minimal"
              disabled={!hasFuture}
              onClick={() => {
                dispatch(UndoActionCreators.redo());
              }}
            />
          </div>
        </Tooltip>
        <Tooltip content="Cut ⌘X">
          <div>
            <StyledIconButton
              fill={defaultTheme.colors.icon.selected}
              icon={CutIcon}
              appearance="minimal"
              disabled={!selectedElement}
              onClick={() => {
                copyElement('Element cut!');
                dispatch(deckSlice.actions.deleteElement());
              }}
            />
          </div>
        </Tooltip>
        <Tooltip content="Copy ⌘C">
          <div>
            <StyledIconButton
              fill={defaultTheme.colors.icon.selected}
              icon={DuplicateIcon}
              appearance="minimal"
              disabled={!selectedElement}
              onClick={() => {
                copyElement('Element copied!');
              }}
            />
          </div>
        </Tooltip>
        <Tooltip content="Paste ⌘P">
          <div>
            <StyledIconButton
              fill={defaultTheme.colors.icon.selected}
              icon={ClipboardIcon}
              appearance="minimal"
              disabled={!hasPaste}
              onClick={() => {
                dispatch(deckSlice.actions.pasteElement());
              }}
            />
          </div>
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
            fill={defaultTheme.colors.icon.danger}
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
              }
            }}
          />
        </Tooltip>
      </MenuSection>

      <SectionDivider />
      <MenuSection>
        <Tooltip content="Present Deck">
          <StyledIconButton
            fill={defaultTheme.colors.icon.selected}
            icon={FullscreenIcon}
            appearance="minimal"
            onClick={() => {
              handleOpenPreviewWindow();
            }}
          />
        </Tooltip>
        <Popover
          position={Position.BOTTOM_LEFT}
          content={({ close }) => (
            <Menu>
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
          <Tooltip content="Preview Size">
            <StyledIconButton
              fill={defaultTheme.colors.icon.selected}
              icon={ZoomInIcon}
              appearance="minimal"
            />
          </Tooltip>
        </Popover>
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

const DeckTitle = styled.div`
  input {
    background: none;
    font-weight: 600;

    &:not(:hover):not(:focus) {
      box-shadow: none;
    }
  }
`;

const MenuSection = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 8px;

  > div {
    margin: 0 2px;
  }
`;

const SectionDivider = styled.div`
  height: 65%;
  border-left: 1px solid ${defaultTheme.scales.neutral.N4A};
`;

const StyledIconButton = styled(IconButton)`
  svg {
    /* Need to override inline style */
    ${(props) =>
      props.disabled ? null : 'fill: ' + props.fill + '!important;'}
  }
`;
