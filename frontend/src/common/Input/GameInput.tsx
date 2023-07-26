import { Color, FontSize } from '@/types/style';
import styled from 'styled-components';

export interface GameInputProps {
  color?: Color;
  fontSize?: FontSize;
  sizes: 'sm' | 'md' | 'lg';
}

export const GameInput = styled.input<GameInputProps>`
  height: 4.8rem;
  border-radius: 0.8rem;
  padding: 0.8rem 1.6rem;

  font-family: 'normal';
  color: ${(props) => props.theme.color.foreground};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  font-size: ${(props) => (props.fontSize ? props.theme.fontSize[props.fontSize] : props.theme.fontSize.md)};

  text-decoration: none;

  border: 3px solid;
  border-color: ${(props) => (props.color ? props.theme.color[props.color] : props.theme.color.primary)};

  ${(props) => {
    switch (props.sizes) {
      case 'sm':
        return `
          width: 12rem;
          height: 4rem;
          border-radius: 0.8rem;
          padding: 0.8remㄴ;
          font-size: 1.2rem;
        `;
      case 'md':
        return `
          width: 16rem;
          height: 4.8rem;
          border-radius: 0.8rem;
          padding: 0.8rem;
          font-size: 1.4rem;
        `;
      case 'lg':
        return `
          max-width: 28rem;
          width: 100%;
          height: 4.8rem;
          border-radius: 0.8rem;
          padding: 0.8rem;
          font-size: 1.6rem;
        `;
    }
  }}
`;
