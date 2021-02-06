import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { background, color, space } from 'styled-system';

const SlideScaleWrapper = styled.div(({ containerStyles }) => [
  containerStyles,
  {
    overflow: 'hidden'
  }
]);

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
  `
);

export const Slide = ({
  children,
  scale,
  backgroundColor,
  textColor,
  padding,
  containerStyles
}) => {
  return (
    <SlideScaleWrapper containerStyles={containerStyles}>
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
  containerStyles: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
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
