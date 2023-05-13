import styled from 'styled-components';
import { Color } from '@/types/style';

export interface InputBoxProps {
  sizes: 'default' | 'sm' | 'md' | 'lg';
  backGroundColor?: Color;
}

// input tag에 size속성이 있어서 size를 다른 이름으로 지정
export const InputBox = styled.input<InputBoxProps>`
  border: 0.05rem solid;
  font-size: 1.5rem;
  background-color: ${(props) =>
    props.backGroundColor
      ? props.theme.color[props.backGroundColor]
      : props.theme.color.transparent}; // transparent or surface
  border-radius: 0.375rem;
  border-color: ${(props) => props.theme.color.gray100};
  padding-left: 1rem;
  padding-right: 1rem;
  // gray100 or foreground
  color: ${(props) => props.theme.color.gray100};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  ${(props) => {
    switch (props.sizes) {
      case 'sm':
        return `
          width: 20rem;
          height: 4rem;
          font-size: 1.8rem;
        `;
      case 'md':
        return `
          width: 48rem;
          height: 4rem;
          font-size: 1.8rem;
        `;
      case 'lg':
        return `
          width: 60rem;
          height: 4rem;
          font-size: 1.8rem;
        `;
      case 'default':
        return `
          width: 100%;
          height: 4rem;
          font-size: 1.8rem;
        `;
    }
  }}
  &:focus {
    outline: none;
    border-color: transparent;
    transition: border-color 0.5s ease-in-out;
  }

  &:focus {
    border-color: ${(props) => props.theme.color.online};
  }
`;
