import { BorderRadius, BoxShadow, Color, LayoutProps, PositionProps } from '@/types/style';
import styled from 'styled-components';

export type BoxProps = {
  borderRadius?: BorderRadius;
  boxShadow?: BoxShadow;
  backgroundColor?: Color;
} & LayoutProps &
  PositionProps;

export const Box = styled.div<BoxProps>`
  ${({ theme }) => `
    border-radius: ${theme.borderRadius.sm};
  `}

  ${(props) => `
    background-color: ${props.theme.color[props.backgroundColor || 'surface']};
    ${props.width && `width: ${props.width};`}
    ${props.height && `height: ${props.height};`}
  `}
`;

Box.defaultProps = {
  width: '100%',
  height: '100%',
};
