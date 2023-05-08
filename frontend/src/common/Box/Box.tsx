import {
  BorderRadius,
  BoxShadow,
  Color,
  FlexContainerProps,
  ItemProps,
  LayoutProps,
  PositionProps,
} from '@/types/style';
import styled, { css } from 'styled-components';

export type BoxProps = {
  borderRadius?: BorderRadius;
  boxShadow?: BoxShadow;
  backgroundColor?: Color;
} & LayoutProps &
  PositionProps &
  FlexContainerProps &
  ItemProps;

export const Box = styled.div<BoxProps>`
  background-color: ${({ theme }) => theme.color.surface};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  ${(props) => css`
    ${props.backgroundColor && `background-color: ${props.theme.color[props.backgroundColor]};`}
    ${props.width && `width: ${props.width};`}
    ${props.height && `height: ${props.height};`}
    ${props.display && `display: ${props.display};`}
    ${props.maxWidth && `max-width: ${props.maxWidth};`}
    ${props.maxHeight && `max-height: ${props.maxHeight};`}
    ${props.minWidth && `min-width: ${props.minWidth};`}
    ${props.minHeight && `min-height: ${props.minHeight};`}
    ${props.margin && `margin: ${props.margin};`}
    ${props.overflow && `overflow: ${props.overflow};`}
    ${props.overflowX && `overflow-x: ${props.overflowX};`}
    ${props.overflowY && `overflow-y: ${props.overflowY};`}
    ${props.position && `position: ${props.position};`}
    ${props.top && `top: ${props.top};`}
    ${props.right && `right: ${props.right};`}
    ${props.bottom && `bottom: ${props.bottom};`}
    ${props.left && `left: ${props.left};`}
    ${props.zIndex && `z-index: ${props.zIndex};`}
    ${props.padding &&
    (typeof props.padding === 'string'
      ? `padding: ${props.theme.padding[props.padding]};`
      : `padding: ${props.padding}rem;`)}
    ${props.boxShadow && `box-shadow: ${props.theme.boxShadow[props.boxShadow]};`}
    ${props.direction && `flex-direction: ${props.direction};`}
    ${props.wrap && `flex-wrap: ${props.wrap};`}
    ${props.gap && `gap: ${props.gap}rem;`}
    ${props.rowGap && `row-gap: ${props.rowGap}rem;`}
    ${props.columnGap && `column-gap: ${props.columnGap}rem;`}
    ${props.justifyContent && `justify-content: ${props.justifyContent};`}
    ${props.alignItems && `align-items: ${props.alignItems};`}
    ${props.alignContent && `align-content: ${props.alignContent};`}
    ${props.alignSelf && `align-self: ${props.alignSelf};`}
    ${props.order && `order: ${props.order};`}
    ${props.flexGrow && `flex-grow: ${props.flexGrow};`}
    ${props.flexShrink && `flex-shrink: ${props.flexShrink};`}
    ${props.flexBasis && `flex-basis: ${props.flexBasis};`}
  `}
`;
