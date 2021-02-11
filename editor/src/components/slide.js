import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { background, color, space } from 'styled-system';

const SlideScaleWrapper = styled.div(({ containerStyle }) => [containerStyle]);

const SlideWrapper = styled('div')(
  color,
  space,
  background,
  ({ scale, theme }) => ({
    width: `${theme.size.width}px`,
    height: `${theme.size.height}px`,
    transform: `scale(${scale || 1})`,
    marginBottom: `-${theme.size.height - scale * theme.size.height}px`,
    marginRight: `-${theme.size.width - scale * theme.size.width}px`,
    transformOrigin: `left top`,
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  })
);

const ContentWrapper = styled('div')(
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

export const Slide = ({
  id,
  children,
  scale,
  backgroundColor,
  textColor,
  padding,
  slideProps = {}
}) => {
  const { containerStyle, handleKeyPress, onSlideClick, ...rest } = slideProps;

  return (
    <SlideScaleWrapper
      containerStyle={containerStyle}
      onClick={() => onSlideClick?.(id)}
      onKeyDown={(event) => handleKeyPress?.(event, id)}
      {...rest}
    >
      <SlideWrapper
        backgroundColor={backgroundColor}
        color={textColor}
        scale={scale}
      >
        <ContentWrapper padding={padding}>{children}</ContentWrapper>
      </SlideWrapper>
    </SlideScaleWrapper>
  );
};

Slide.propTypes = {
  id: PropTypes.string,
  slideProps: PropTypes.object,
  backgroundColor: PropTypes.string,
  scale: PropTypes.number,
  textColor: PropTypes.string,
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node
};

Slide.defaultProps = {
  textColor: 'primary',
  backgroundColor: 'tertiary',
  backgroundPosition: 'center',
  padding: 2
};
