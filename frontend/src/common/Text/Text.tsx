import { Color, FontSize, FontWeight, TextShadow } from '@/types/style';
import styled from 'styled-components';

interface TextProps {
  size?: FontSize;
  color?: Color;
  weight?: FontWeight;
  children: string;
  fontFamily?: 'normal' | 'game';
  shadow?: TextShadow;
}

export const Text = styled.span<TextProps>`
  font-family: ${(props) => props.fontFamily || 'normal'};
  font-size: ${(props) => props.theme.fontSize[props.size || 'md']};
  color: ${(props) => props.theme.color[props.color || 'foreground']};
  font-weight: ${(props) => props.theme.fontWeight[props.weight || 'regular']};
  text-shadow: ${(props) => props.theme.textShadow[props.shadow || 'none']};
  line-height: 1.5;
  overflow-wrap: break-word;
`;
