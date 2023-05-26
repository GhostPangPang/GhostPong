import styled, { css } from 'styled-components';
import profile from '@/svgs/default-profile.svg';
import { Color } from '@/types/style';

export type AvatarProps = {
  size?: 'sm' | 'md' | 'lg' | 'llg' | 'xl';
  borderColor?: Color;
  onClick?: React.MouseEventHandler;
  style?: React.CSSProperties;
} & React.ComponentPropsWithoutRef<'img'>;

const StyledAvatar = styled.img<AvatarProps>`
  border-radius: 50%;
  object-fit: cover;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  ${(props) => {
    switch (props.size) {
      case 'sm':
        return css`
          ${props.borderColor && 'border-width: 0.15rem; border-style: solid;'}
          width: 2.4rem;
          height: 2.4rem;
        `;
      case 'md':
        return css`
          ${props.borderColor && 'border-width: 0.2rem; border-style: solid;'}
          width: 4rem;
          height: 4rem;
        `;
      case 'lg':
        return css`
          ${props.borderColor && 'border-width: 0.3rem; border-style: solid;'}
          width: 6.4rem;
          height: 6.4rem;
        `;
      case 'llg':
        return css`
          ${props.borderColor && 'border-width: 0.3rem; border-style: solid;'}
          width: 10rem;
          height: 10rem;
        `;
      case 'xl':
        return css`
          ${props.borderColor && 'border-width: 0.5rem; border-style: solid;'}
          width: 16rem;
          height: 16rem;
        `;
    }
  }}
  ${(props) => {
    return (
      props.borderColor &&
      (props.borderColor !== 'gradient'
        ? `border-color: ${props.theme.color[props.borderColor]};`
        : `border-color: transparent; background-image: linear-gradient(#fff, #fff), ${
            props.theme.color[props.borderColor]
          };
          background-origin: border-box;
          background-clip: content-box, border-box;`)
    );
  }}
`;

export const Avatar = ({ size = 'md', src = profile, onClick, borderColor, style, ...props }: AvatarProps) => {
  return <StyledAvatar size={size} src={src} onClick={onClick} borderColor={borderColor} style={style} {...props} />;
};
