import React, { PropsWithChildren } from 'react';
import {
  Tooltip as _Tooltip,
  TooltipProps,
  SideSheet as _SideSheet,
  SideSheetProps
} from 'evergreen-ui';
import { DndProvider as _DndProvider, DndProviderProps } from 'react-dnd';

export const Tooltip = _Tooltip as React.FC<PropsWithChildren<TooltipProps>>;

export const DndProvider = _DndProvider as React.FC<
  PropsWithChildren<DndProviderProps<unknown, unknown>>
>;

type SlideSheetCallbackOptions = {
  close(): void;
};
export const SideSheet = _SideSheet as React.FC<
  Omit<SideSheetProps, 'children'> & {
    children:
      | React.ReactNode
      | ((options: SlideSheetCallbackOptions) => JSX.Element);
  }
>;
