import { BorderRadius, BoxShadow, LayoutProps, PositionProps } from '@/types/style';
import styled from 'styled-components';

export type BoxProps = {
  borderRadius?: BorderRadius;
  boxShadow?: BoxShadow;
} & LayoutProps &
  PositionProps;

export const Box = styled.div<BoxProps>`
  ${({ theme }) => `
    background-color: ${theme.color.surface};
    border-radius: ${theme.borderRadius.sm};
  `}

  ${(props) => `
    ${props.width && `width: ${props.width};`}
    ${props.height && `height: ${props.height};`}
  `}
`;

Box.defaultProps = {
  width: '100%',
  height: '100%',
};
