import {
  AlignmentBottomIcon,
  AlignmentHorizontalCenterIcon,
  AlignmentLeftIcon,
  AlignmentRightIcon,
  AlignmentTopIcon,
  AlignmentVerticalCenterIcon
} from 'evergreen-ui';
import { ElementType } from 'react';

export enum ALIGNMENT_TYPES {
  LEFT = 'left',
  VERTICAL_CENTER = 'verticalCenter',
  RIGHT = 'right',
  TOP = 'top',
  HORIZONTAL_CENTER = 'horizontalCenter',
  BOTTOM = 'bottom'
}

export const ALIGNMENT_OPTIONS: {
  [key in ALIGNMENT_TYPES]: { icon: ElementType<any>; tooltip: string };
} = {
  [ALIGNMENT_TYPES.LEFT]: {
    icon: AlignmentLeftIcon,
    tooltip: 'Align left'
  },
  [ALIGNMENT_TYPES.HORIZONTAL_CENTER]: {
    icon: AlignmentVerticalCenterIcon,
    tooltip: 'Align horizontal center'
  },
  [ALIGNMENT_TYPES.RIGHT]: {
    icon: AlignmentRightIcon,
    tooltip: 'Align right'
  },
  [ALIGNMENT_TYPES.TOP]: {
    icon: AlignmentTopIcon,
    tooltip: 'Align top'
  },
  [ALIGNMENT_TYPES.VERTICAL_CENTER]: {
    icon: AlignmentHorizontalCenterIcon,
    tooltip: 'Align vertical center'
  },
  [ALIGNMENT_TYPES.BOTTOM]: {
    icon: AlignmentBottomIcon,
    tooltip: 'Align bottom'
  }
};
