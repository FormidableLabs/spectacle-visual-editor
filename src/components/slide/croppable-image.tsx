import React from 'react';
import { Image as SpectacleImage } from 'spectacle';
const Image = React.forwardRef<
  {},
  {
    src: string;
    isSelected: boolean;
    croppedSrc?: string;
    onLoad?: React.ReactEventHandler<Record<string, unknown>>;
    componentProps?: any;
  }
>(function InternalImageWithRef(props, forwardedRef) {
  const { onLoad } = props;

  const imageSource = React.useMemo(() => {
    return props.croppedSrc || props.src;
  }, [props.src, props.croppedSrc]);

  const interceptRef = React.useCallback(
    (ref: HTMLImageElement | null) => {
      if (typeof forwardedRef === 'function') {
        forwardedRef(ref);
      } else if (typeof forwardedRef === 'object' && forwardedRef) {
        forwardedRef.current = ref;
      }
    },
    [forwardedRef]
  );

  const interceptOnLoad = React.useCallback(
    (e: React.SyntheticEvent<Record<string, unknown>, Event>) => {
      onLoad && onLoad(e);
    },
    [onLoad]
  );

  return (
    <>
      <SpectacleImage
        {...props}
        //  @ts-ignore
        ref={interceptRef}
        src={imageSource}
        onLoad={interceptOnLoad}
      />
    </>
  );
});

export default Image;
