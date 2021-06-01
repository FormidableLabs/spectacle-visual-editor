import React, { Attributes } from 'react';
import {
  Slide,
  FlexBox,
  Heading,
  SpectacleLogo,
  Box,
  Image as SpectacleImage,
  Grid,
  ListItem,
  OrderedList,
  UnorderedList,
  Markdown,
  CodePane
} from 'spectacle';
import { Slide as InternalSlide } from './slide';
import { SelectionFrame } from './selection-frame';
import Cropper from 'cropperjs';
import { Dialog } from 'evergreen-ui';

// @ts-ignore
const Image = React.forwardRef<{}, { src: string; isSelected: boolean }>(
  (props, forwardedRef) => {
    const [
      dialogImageRef,
      setDialogImageRef
    ] = React.useState<HTMLImageElement | null>();
    const [isCropModalOpen, setCropModalOpen] = React.useState<boolean>(false);
    const [croppedSource, setCroppedSource] = React.useState<
      string | undefined
    >(undefined);
    const cropperInstance = React.useRef<Cropper | undefined>();

    React.useEffect(() => {
      if (dialogImageRef && isCropModalOpen) {
        cropperInstance.current = new Cropper(dialogImageRef, {
          aspectRatio: 16 / 9
        });
      }
    }, [dialogImageRef, isCropModalOpen]);

    const imageSource = React.useMemo(() => {
      return croppedSource || props.src;
    }, [props.src, croppedSource]);

    return (
      <>
        <Dialog
          isShown={isCropModalOpen}
          title="Edit your image"
          onCloseComplete={() => setCropModalOpen(false)}
          confirmLabel="Save your changes"
          onConfirm={() => {
            const e = cropperInstance.current?.getCroppedCanvas();

            if (!e) {
              return;
            }

            setCroppedSource(e.toDataURL());
          }}
        >
          <div>
            <img src={props.src} ref={(r) => setDialogImageRef(r)} />
          </div>
        </Dialog>
        <SpectacleImage
          {...props}
          //  @ts-ignore
          ref={forwardedRef}
          src={imageSource}
        />
        {props.isSelected && (
          <div
            style={{ position: 'absolute', top: 453, left: 28, zIndex: 10 }}
            onClick={() => {
              setCropModalOpen(true);
            }}
          >
            Edit image
          </div>
        )}
      </>
    );
  }
);

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
  Markdown,
  CodePane
};

export const SPECTACLE_PREVIEW_OBJECT_MAP = {
  ...SPECTACLE_INTERNAL_OBJECT_MAP,
  Slide
};

export interface GenerateOptions {
  component: string;
  props: Record<string, any>;
  id: string;
  children: React.ReactNode;
  traversalState?: number[];
}

/**
 * Returns a curried function for generating a slide tree.
 */
export const generateSlideTreeFromMap = (
  map: Record<string, React.ReactNode>,
  editable = false
) => {
  /**
   * Creates a React node tree of slide and slide elements based on the JSON format.
   * @param component Either an HTML primitive or string that maps to a Spectacle component
   * @param props Any properties required to render the component
   * @param id A unique identifier that serves as the key in the tree
   * @param children Any elements that are rendered inside of this component
   * @returns {React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
   */
  return function generateSlideTree({
    component,
    props,
    id,
    children,
    traversalState = [0]
  }: GenerateOptions) {
    /* Ensure the id and any props are included in the React node */
    const newElementProps = {
      id,
      ...props,
      key: id,
      type: component,
      animateListItems: editable ? false : props?.animateListItems
    } as Attributes;

    /* Determine if the component is a Spectacle component or HTML primitive  */
    const newElementComponentType =
      component in map ? (map[component] as React.ComponentClass) : component;

    /* If the child is an array recursively call this function to render all children */
    const newElementChildren =
      children instanceof Array
        ? (children as GenerateOptions[]).map((c, idx) =>
            generateSlideTree({
              ...c,
              traversalState: [...traversalState, idx]
            })
          )
        : children;

    const newElement = React.createElement(
      newElementComponentType,
      newElementProps,
      newElementChildren
    ) as React.ReactElement;

    if (!editable || component === 'Slide') {
      return newElement;
    }

    return (
      <SelectionFrame key={`${id}-frame`} treeId={traversalState.join('->')}>
        {newElement}
      </SelectionFrame>
    );
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
