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

const OBJECT_MAP = {
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

export const generateSlideTree = ({ component, props, id, children }) =>
  React.createElement(
    component in OBJECT_MAP ? OBJECT_MAP[component] : component,
    { key: id, ...props },
    children instanceof Array ? children.map(generateSlideTree) : children
  );
