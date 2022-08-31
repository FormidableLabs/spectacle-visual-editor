import React, { PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css, InterpolationValue } from 'styled-components';
import {
  background,
  color,
  space,
  BackgroundColorProps,
  PaddingProps,
  SpaceProps
} from 'styled-system';
import { deckSlice } from '../../slices/deck-slice';

export const SlideScaleWrapper = styled.div<{
  containerStyle: InterpolationValue;
}>(({ containerStyle }) =>
  Array.isArray(containerStyle) ? containerStyle : [containerStyle]
);

interface SlideWrapperProps
  extends SpaceProps,
    BackgroundColorProps,
    SpaceProps,
    PaddingProps {
  scale: number;
}

const SlideWrapper = styled('div').attrs<SlideWrapperProps>(
  ({ scale, theme }) => ({
    style: {
      transform: `scale(${scale || 1})`,
      marginBottom: `${scale >= 1 ? '' : '-'}${Math.abs(
        theme.size.height - scale * theme.size.height
      )}px`,
      marginRight: `${scale >= 1 ? '' : '-'}${Math.abs(
        theme.size.width - scale * theme.size.width
      )}px`
    }
  })
)<SlideWrapperProps>(color, space, background, ({ theme }) => [
  {
    width: `${theme.size.width}px`,
    height: `${theme.size.height}px`,
    transformOrigin: `left top`,
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  css`
    ul {
      list-style-type: disc;
    }
    ol {
      list-style-type: decimal;
    }
  `
]);

const ContentWrapper = styled('div')<SpaceProps>(
  space,
  css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    transform-origin: left top;
    overflow: hidden;
  `
);

interface Props {
  id: string;
  slideProps: {
    containerStyle: InterpolationValue;
    onSlideClick?(id: string): void;
    handleKeyPress?(key: string, id: string): void;
  };
  backgroundColor?: string;
  backgroundPosition?: string;
  scale: number;
  textColor?: string;
  padding?: number | string;
}

export const Slide = ({
  id,
  children,
  scale,
  backgroundColor,
  textColor,
  padding,
  slideProps = {
    containerStyle: ''
  }
}: PropsWithChildren<Props>) => {
  const { containerStyle, handleKeyPress, onSlideClick, ...rest } = slideProps;
  const dispatch = useDispatch();

  return (
    <SlideScaleWrapper
      containerStyle={containerStyle}
      onClick={() => onSlideClick?.(id)}
      onKeyDown={(event) => handleKeyPress?.(event.key, id)}
      {...rest}
    >
      <SlideWrapper
        backgroundColor={backgroundColor}
        color={textColor}
        scale={scale}
      >
        <ContentWrapper
          padding={padding}
          onMouseDown={(event) => {
            // Catch clicks on the slide and clear the selected state for any of
            // the components appearing in the slide
            if (event.target === event.currentTarget) {
              dispatch(deckSlice.actions.editableElementSelected(null));
            }
          }}
        >
          {children}
        </ContentWrapper>
      </SlideWrapper>
    </SlideScaleWrapper>
  );
};
Slide.defaultProps = {
  textColor: 'primary',
  backgroundColor: 'tertiary',
  backgroundPosition: 'center',
  padding: 2
};
