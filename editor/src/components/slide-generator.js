import React from 'react';
import {
  FlexBox,
  Heading,
  SpectacleLogo,
  Box,
  Image,
  Grid,
  ListItem,
  OrderedList,
  UnorderedList
} from 'spectacle';
import { Slide } from './slide';

const SPECTACLE_INTERNAL_OBJECT_MAP = {
  Slide,
  FlexBox,
  Heading,
  SpectacleLogo,
  Box,
  Image,
  Grid,
  ListItem,
  OrderedList,
  UnorderedList
};

/**
 * Creates a React node tree of slide and slide elements based on the JSON format.
 * @param component Either an HTML primitive or string that maps to a Spectacle component
 * @param props Any properties required to render the component
 * @param id A unique identifier that serves as the key in the tree
 * @param children Any elements that are rendered inside of this component
 * @returns {React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
 */
export const generateSlideTree = ({ component, props, id, children }) =>
  React.createElement(
    /* Determine if the component is a Spectacle component or HTML primitive  */
    component in SPECTACLE_INTERNAL_OBJECT_MAP
      ? SPECTACLE_INTERNAL_OBJECT_MAP[component]
      : component,
    /* Ensure the id and any props are included in the React node */
    { id, ...props, key: id },
    /* If the child is an array recursively call this function to render all children */
    children instanceof Array ? children.map(generateSlideTree) : children
  );
