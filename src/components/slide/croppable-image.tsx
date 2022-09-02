import React from 'react';
import { Image as SpectacleImage } from 'spectacle';

const Image = React.forwardRef<
  HTMLImageElement,
  {
    src: string;
    isSelected: boolean;
    croppedSrc?: string;
    onLoad?: React.ReactEventHandler<Record<string, unknown>>;
    style?: React.CSSProperties;
    componentProps?: { [key: string]: any };
  }
>(function InternalImageWithRef(
  { src, croppedSrc, style, ...otherProps },
  forwardedRef
) {
  return (
    <SpectacleImage
      {...otherProps}
      src={croppedSrc || src}
      style={{ maxWidth: 'none', ...style } as CSSStyleDeclaration}
      // We expect an error here because Spectacle's Image component forces a
      // different type on the ref, in spite of it being just a plain ref to an
      // HTMLImageElement
      // @ts-expect-error
      ref={forwardedRef}
    />
  );
});

export default Image;
