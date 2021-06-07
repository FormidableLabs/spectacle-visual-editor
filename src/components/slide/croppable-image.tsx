import React from 'react';

import Cropper from 'cropperjs';
import { Dialog, CogIcon, IconButton, UndoIcon, toaster } from 'evergreen-ui';
import { useDispatch } from 'react-redux';
import { Image as SpectacleImage } from 'spectacle';
import styled from 'styled-components';

import { deckSlice } from '../../slices/deck-slice';

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
`;

const Overlay = styled.div<{
  left: number;
  top: number;
  width: number;
  height: number;
}>`
  position: absolute;
  left: ${(props) => props.left + 'px;'};
  top: ${(props) => props.top + 'px;'};
  width: ${(props) => props.width + 'px;'};
  height: ${(props) => props.height + 'px;'};
`;

const Image = React.forwardRef<
  {},
  {
    src: string;
    isSelected: boolean;
    croppedSrc?: string;
    onLoad?: React.ReactEventHandler<Record<string, unknown>>;
  }
>((props, forwardedRef) => {
  const { onLoad } = props;

  const [
    dialogImageRef,
    setDialogImageRef
  ] = React.useState<HTMLImageElement | null>();
  const [isCropModalOpen, setCropModalOpen] = React.useState<boolean>(false);
  const [
    spectacleImage,
    setSpectacleImage
  ] = React.useState<HTMLImageElement | null>(null);
  const [hasImageLoaded, setImageLoaded] = React.useState(false);
  const [imageDimensions, setImageDimensions] = React.useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const cropperInstance = React.useRef<Cropper | undefined>();

  React.useEffect(() => {
    if (dialogImageRef && isCropModalOpen) {
      cropperInstance.current = new Cropper(dialogImageRef, {
        aspectRatio: 16 / 9
      });
    }
  }, [dialogImageRef, isCropModalOpen]);

  React.useEffect(() => {
    let observer: ResizeObserver;

    if (spectacleImage) {
      observer = new window.ResizeObserver((elements) => {
        const target = elements[0].target as HTMLImageElement;

        setImageDimensions({
          left: target.offsetLeft,
          top: target.offsetTop,
          width: target.offsetWidth,
          height: target.offsetHeight
        });
      });

      observer.observe(spectacleImage);
    }

    return () => {
      if (observer && spectacleImage) {
        observer.unobserve(spectacleImage);
      }
    };
  }, [spectacleImage]);

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

      setSpectacleImage(ref);
    },
    [forwardedRef]
  );

  const interceptOnLoad = React.useCallback(
    (e: React.SyntheticEvent<Record<string, unknown>, Event>) => {
      setImageLoaded(true);
      onLoad && onLoad(e);
    },
    [onLoad, setImageLoaded]
  );

  const dispatch = useDispatch();

  return (
    <>
      <Dialog
        isShown={isCropModalOpen}
        title="Edit your image"
        onCloseComplete={() => setCropModalOpen(false)}
        confirmLabel="Save changes"
        width="75%"
        onConfirm={() => {
          const e = cropperInstance.current?.getCroppedCanvas();

          if (!e) {
            return toaster.warning('Could not crop the image.');
          }

          dispatch(
            deckSlice.actions.editableElementChanged({
              croppedSrc: e.toDataURL()
            })
          );

          setCropModalOpen(false);
        }}
      >
        <div>
          <img src={props.src} ref={(r) => setDialogImageRef(r)} />
        </div>
      </Dialog>
      <SpectacleImage
        {...props}
        //  @ts-ignore
        ref={interceptRef}
        src={imageSource}
        onLoad={interceptOnLoad}
      />
      {props.isSelected && hasImageLoaded && !!imageDimensions && (
        <Overlay
          left={imageDimensions.left}
          top={imageDimensions.top}
          width={imageDimensions.width}
          height={imageDimensions.height}
        >
          <ButtonContainer>
            {props.croppedSrc && (
              <IconButton
                onClick={() => {
                  dispatch(
                    deckSlice.actions.editableElementChanged({
                      croppedSrc: undefined
                    })
                  );
                }}
                icon={UndoIcon}
                height={48}
                marginLeft="auto"
                marginBottom="8px"
              />
            )}
            <IconButton
              onClick={() => {
                setCropModalOpen(true);
              }}
              icon={CogIcon}
              height={48}
              marginLeft="auto"
            />
          </ButtonContainer>
        </Overlay>
      )}
    </>
  );
});

export default Image;
