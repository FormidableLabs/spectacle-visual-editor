import React from 'react';
import {
  Slide,
  FlexBox,
  Heading,
  SpectacleLogo,
  Box,
  Image,
  Grid,
  ListItem,
  OrderedList,
  UnorderedList,
  Markdown
} from 'spectacle';
import { Slide as InternalSlide } from './slide';
import { SelectionFrame } from './selection-frame';

export const SPECTACLE_INTERNAL_OBJECT_MAP = {
  Slide: InternalSlide,
  FlexBox,
  Heading,
  SpectacleLogo,
  Box,
  Image,
  Grid,
  ListItem,
  OrderedList,
  UnorderedList,
  Markdown
};

export const SPECTACLE_PREVIEW_OBJECT_MAP = {
  ...SPECTACLE_INTERNAL_OBJECT_MAP,
  Slide
};

/**
 * Returns a curried function for generating a slide tree.
 * @param map A mapping of components
 * @returns {function({component: *, props: *, id?: *, children: *}):
 *  React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
 */
export const generateSlideTreeFromMap = (map, editable = false) => {
  /**
   * Creates a React node tree of slide and slide elements based on the JSON format.
   * @param component Either an HTML primitive or string that maps to a Spectacle component
   * @param props Any properties required to render the component
   * @param id A unique identifier that serves as the key in the tree
   * @param children Any elements that are rendered inside of this component
   * @returns {React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
   */
  return function generateSlideTree({ component, props, id, children }) {
    const newElement = React.createElement(
      /* Determine if the component is a Spectacle component or HTML primitive  */
      component in map ? map[component] : component,
      /* Ensure the id and any props are included in the React node */
      { id, ...props, key: id, type: component },
      /* If the child is an array recursively call this function to render all children */
      children instanceof Array ? children.map(generateSlideTree) : children
    );
    if (!editable || component === 'Slide') {
      return newElement;
    }
    return <SelectionFrame key={`${id}-frame`}>{newElement}</SelectionFrame>;
  };
};

export const generateInternalSlideTree = generateSlideTreeFromMap(
  SPECTACLE_INTERNAL_OBJECT_MAP
);
export const generateInternalEditableSlideTree = generateSlideTreeFromMap(
  SPECTACLE_INTERNAL_OBJECT_MAP,
  true
);
export const generatePreviewSlideTree = generateSlideTreeFromMap(
  SPECTACLE_PREVIEW_OBJECT_MAP
);
