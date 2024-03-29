import styled from 'styled-components';
import { Color } from '@/types/style';
import { darken, lighten } from 'polished';

export interface GameButtonProps {
  size: 'sm' | 'md' | 'lg' | 'img';
  color?: Color;
}

export const GameButton = styled.button<GameButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: 'game', 'normal';
  font-weight: ${(props) => props.theme.fontWeight.bold};

  background-color: ${(props) => props.theme.color.gray200};
  color: ${(props) => props.theme.color.foreground};
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: 3px solid;

  &:hover {
    background: ${(props) => lighten(0.1, props.theme.color.gray200)};
  }
  &:active {
    background: ${(props) => darken(0.1, props.theme.color.gray200)};
  }

  border-color: ${(props) => (props.color ? props.theme.color[props.color] : props.theme.color.primary)};
  ${(props) => {
    switch (props.size) {
      case 'sm':
        return `
          width: 12rem;
          height: 4rem;
          border-radius: 0.8rem;
          padding: 0.8rem 1.6rem;
          font-size: 1.2rem;
        `;
      case 'md':
        return `
          width: 16rem;
          height: 4.8rem;
          border-radius: 0.8rem;
          padding: 0.8rem 1.6rem;
          font-size: 1.4rem;
        `;
      case 'lg':
        return `
          max-width: 28rem;
          width: 100%;
          height: 4.8rem;
          border-radius: 0.8rem;
          padding: 0.8rem 1.6rem;
          font-size: 1.6rem;
        `;
      case 'img':
        return `
          width: fit-content;
          height: fit-content;
          border-radius: 0.8rem;
          padding: 0.8rem 0.8rem;
        `;
    }
  }}
`;
