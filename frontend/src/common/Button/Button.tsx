import styled from 'styled-components';
import { Color } from '@/types/style';
import { darken, lighten } from 'polished';

export interface ButtonProps {
  size: 'sm' | 'md' | 'lg';
  color?: Color;
}

export const Button = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: 'ChailceNoggin';
  font-weight: ${(props) => props.theme.fontWeight.bold};

  background-color: ${(props) => props.theme.color.gray};
  color: ${(props) => props.theme.color.foreground};
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: 3px solid;

  &:hover {
    background: ${(props) => lighten(0.1, props.theme.color.surface)};
  }
  &:active {
    background: ${(props) => darken(0.1, props.theme.color.surface)};
  }
  & + & {
    margin-left: 1rem;
  }

  border-color: ${(props) => props.color || props.theme.color.primary};
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
          width: 42rem;
          height: 4.8rem;
          border-radius: 0.8rem;
          padding: 0.8rem 1.6rem;
          font-size: 1.6rem;
        `;
    }
  }}
`;
