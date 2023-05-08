import { Color, FontSize, FontWeight } from '@/types/style';
import styled from 'styled-components';

interface TextProps {
  size?: FontSize;
  color?: Color;
  weight?: FontWeight;
  children: string;
}

export const Text = styled.span<TextProps>`
  font-size: ${(props) => props.theme.fontSize[props.size || 'md']};
  color: ${(props) => props.theme.color[props.color || 'foreground']};
  font-weight: ${(props) => props.theme.fontWeight[props.weight || 'regular']};
  line-height: 1.5;
`;
