import styled from 'styled-components';
import profile from '@/svgs/default-profile.svg';
import { Color } from '@/types/style';

export type AvatarProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  borderColor?: Color;
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
} & React.ComponentPropsWithoutRef<'img'>;

const StyledAvatar = styled.img<AvatarProps>`
  border-radius: 50%;
  object-fit: cover;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  ${(props) => {
    switch (props.size) {
      case 'sm':
        return `
        ${props.borderColor && 'border-width: 0.15rem; border-style: solid;'}
        width: 2.4rem;
        height: 2.4rem;
        `;
      case 'md':
        return `
        ${props.borderColor && 'border-width: 0.2rem; border-style: solid;'}
        width: 4rem;
        height: 4rem;
        `;
      case 'lg':
        return `
        ${props.borderColor && 'border-width: 0.3rem; border-style: solid;'}
        width: 6.4rem;
        height: 6.4rem;
        `;
      case 'xl':
        return `
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

export const Avatar = ({ size = 'md', src = profile, onClick, ...props }: AvatarProps) => {
  return <StyledAvatar as="img" size={size} src={src} onClick={onClick} {...props} />;
};
