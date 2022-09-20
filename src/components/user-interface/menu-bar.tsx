import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import {
  defaultTheme,
  Menu,
  Popover,
  Position,
  Pane,
  Dialog,
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
  DocumentIcon,
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
import { Tooltip } from '../component-adapter';
import { KeyboardShortcut } from './keyboard-shortcut';

const MenuBarContainer = styled.div`
  width: 100%;
  height: 38px;
  background: ${defaultTheme.colors.gray100};
  border-bottom: ${defaultTheme.colors.gray500} 1px solid;
  display: flex;
  align-items: center;
`;

const DeckTitleInput = styled(TextInput)`
  &:not(:hover):not(:focus) {
    border-color: ${defaultTheme.colors.gray100};
  }
`;

const LogoContainer = styled.div`
  margin: 0 2px 0 16px;
`;

const TooltipContent = styled.p`
  color: ${defaultTheme.colors.white};

  kbd {
    color: ${defaultTheme.colors.gray400};
  }
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
  const copyElement = () => dispatch(deckSlice.actions.copyElement());

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
      [KEYBOARD_SHORTCUTS.DELETE]: (e) => {
        e?.preventDefault();
        if (
          selectedElement &&
          CONTAINER_ELEMENTS.includes(selectedElement.component)
        ) {
          toggleDialog();
        } else {
          dispatch(deckSlice.actions.deleteElement());
        }
      },
      [KEYBOARD_SHORTCUTS.CUT]: () => {
        copyElement();
        dispatch(deckSlice.actions.deleteElement());
      },
      [KEYBOARD_SHORTCUTS.COPY]: () => copyElement(),
      [KEYBOARD_SHORTCUTS.PASTE]: () =>
        dispatch(deckSlice.actions.pasteElement()),
      [KEYBOARD_SHORTCUTS.UNDO]: () => dispatch(UndoActionCreators.undo()),
      [KEYBOARD_SHORTCUTS.REDO]: () => dispatch(UndoActionCreators.redo())
    },
    []
  );

  const saveFile = useSaveFile();

  // TODO: refine to depth level 3/4
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
            <DeckTitleInput
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
        <Tooltip
          content={
            <TooltipContent>
              Open Deck <KeyboardShortcut sequence={KEYBOARD_SHORTCUTS.OPEN} />
            </TooltipContent>
          }
        >
          <StyledIconButton
            fill={defaultTheme.colors.selected}
            icon={FolderCloseIcon}
            appearance="minimal"
            onClick={() => {
              dispatch(editorSlice.actions.toggleSavedDecksMenu());
            }}
          />
        </Tooltip>
        <Tooltip content="New Deck">
          <StyledIconButton
            fill={defaultTheme.colors.selected}
            icon={DocumentIcon}
            appearance="minimal"
            onClick={() => {
              dispatch(deckSlice.actions.resetDeck());
              dispatch(deckSlice.actions.newSlideAdded());
            }}
          />
        </Tooltip>
        <Tooltip
          content={
            <TooltipContent>
              Save Deck <KeyboardShortcut sequence={KEYBOARD_SHORTCUTS.SAVE} />
            </TooltipContent>
          }
        >
          <div>
            <StyledIconButton
              fill={defaultTheme.colors.selected}
              icon={FloppyDiskIcon}
              appearance="minimal"
              disabled={isSaved}
              onClick={() => dispatch(deckSlice.actions.saveDeck(id))}
            />
          </div>
        </Tooltip>
        <Tooltip content="Export as HTML file">
          <div>
            <StyledIconButton
              fill={defaultTheme.colors.selected}
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
                  console.warn(
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
              fill={defaultTheme.colors.selected}
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
              fill={defaultTheme.colors.selected}
              icon={GridViewIcon}
              appearance="minimal"
            />
          </Tooltip>
        </Popover>
      </MenuSection>
      <SectionDivider />
      <MenuSection>
        <Tooltip
          content={
            <TooltipContent>
              Undo <KeyboardShortcut sequence={KEYBOARD_SHORTCUTS.UNDO} />
            </TooltipContent>
          }
        >
          <div>
            <StyledIconButton
              fill={defaultTheme.colors.selected}
              icon={UndoIcon}
              appearance="minimal"
              disabled={!hasPast}
              onClick={() => {
                dispatch(UndoActionCreators.undo());
              }}
            />
          </div>
        </Tooltip>

        <Tooltip
          content={
            <TooltipContent>
              Redo <KeyboardShortcut sequence={KEYBOARD_SHORTCUTS.REDO} />
            </TooltipContent>
          }
        >
          <div>
            <StyledIconButton
              fill={defaultTheme.colors.selected}
              icon={RedoIcon}
              appearance="minimal"
              disabled={!hasFuture}
              onClick={() => {
                dispatch(UndoActionCreators.redo());
              }}
            />
          </div>
        </Tooltip>

        <Tooltip
          content={
            <TooltipContent>
              Cut <KeyboardShortcut sequence={KEYBOARD_SHORTCUTS.CUT} />
            </TooltipContent>
          }
        >
          <div>
            <StyledIconButton
              fill={defaultTheme.colors.selected}
              icon={CutIcon}
              appearance="minimal"
              disabled={!selectedElement}
              onClick={() => {
                copyElement();
                dispatch(deckSlice.actions.deleteElement());
              }}
            />
          </div>
        </Tooltip>

        <Tooltip
          content={
            <TooltipContent>
              Copy <KeyboardShortcut sequence={KEYBOARD_SHORTCUTS.COPY} />
            </TooltipContent>
          }
        >
          <div>
            <StyledIconButton
              fill={defaultTheme.colors.selected}
              icon={DuplicateIcon}
              appearance="minimal"
              disabled={!selectedElement}
              onClick={copyElement}
            />
          </div>
        </Tooltip>

        <Tooltip
          content={
            <TooltipContent>
              Paste <KeyboardShortcut sequence={KEYBOARD_SHORTCUTS.PASTE} />
            </TooltipContent>
          }
        >
          <div>
            <StyledIconButton
              fill={defaultTheme.colors.selected}
              icon={ClipboardIcon}
              appearance="minimal"
              disabled={!hasPaste}
              onClick={() => {
                dispatch(deckSlice.actions.pasteElement());
              }}
            />
          </div>
        </Tooltip>

        <Tooltip
          content={
            <TooltipContent>
              Delete <KeyboardShortcut sequence={KEYBOARD_SHORTCUTS.DELETE} />
            </TooltipContent>
          }
        >
          <div>
            <StyledIconButton
              fill={defaultTheme.intents.danger.icon}
              icon={TrashIcon}
              appearance="minimal"
              intent="danger"
              disabled={!selectedElement}
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
          </div>
        </Tooltip>
      </MenuSection>

      <SectionDivider />
      <MenuSection>
        <Tooltip content="Present Deck">
          <StyledIconButton
            fill={defaultTheme.colors.selected}
            icon={FullscreenIcon}
            appearance="minimal"
            onClick={handleOpenPreviewWindow}
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
                  { label: 'Actual size', value: 1 }
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
              fill={defaultTheme.colors.selected}
              icon={ZoomInIcon}
              appearance="minimal"
            />
          </Tooltip>
        </Popover>
      </MenuSection>
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
    </MenuBarContainer>
  );
};

const InsertItems: { title: string; element: typeof ELEMENTS[number] }[] = [
  { title: 'Heading', element: ELEMENTS.HEADING },
  { title: 'Text Box', element: ELEMENTS.TEXT },
  { title: 'List', element: ELEMENTS.LIST },
  { title: 'Image', element: ELEMENTS.IMAGE },
  { title: 'Box', element: ELEMENTS.BOX },
  { title: 'CodePane', element: ELEMENTS.CODEPANE },
  { title: 'Progress', element: ELEMENTS.PROGRESS },
  { title: 'FullScreen', element: ELEMENTS.FULL_SCREEN }
];

const nonNestableElements: SPECTACLE_ELEMENTS[] = [
  // ELEMENTS.BOX.component,
  // ELEMENTS.GRID.component
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
    font-weight: 700;

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
  border-left: 1px solid ${defaultTheme.colors.gray400};
`;

const StyledIconButton = styled(IconButton)`
  svg {
    /* Need to override inline style */
    ${(props) =>
      props.disabled ? null : 'fill: ' + props.fill + '!important;'}
  }
`;
