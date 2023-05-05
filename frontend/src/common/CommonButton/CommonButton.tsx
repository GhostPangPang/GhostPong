import styled from 'styled-components';
import { Color } from '@/types/style';
import { darken, lighten } from 'polished';

export interface CommonButtonProps {
  size: 'sm' | 'md' | 'lg';
  backgroundColor?: Color;
}

export const CommonButton = styled.button<CommonButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.05rem solid;
  border-radius: 0.375rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  color: ${(props) => props.theme.color.gray300};
  ${(props) => {
    const bgColor = props.backgroundColor ? props.theme.color[props.backgroundColor] : props.theme.color.gray100;
    return `
      background-color: ${bgColor};
      border-color: ${bgColor};
      &:hover {
        background: ${lighten(0.1, bgColor)};
      }
      &:active {
        background: ${darken(0.1, bgColor)};
      }
    `;
  }}
  ${(props) => {
    switch (props.size) {
      case 'sm':
        return `
          width: 8rem;
          height: 3rem;
          font-size: 1.3rem;
        `;
      case 'md':
        return `
          width: 12rem;
          height: 3rem;
          font-size: 1.3rem;
        `;
      case 'lg':
        return `
          width: 24rem;
          height: 3rem;
          font-size: 1.3rem;
        `;
    }
  }}
`;
