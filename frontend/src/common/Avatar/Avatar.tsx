import styled from 'styled-components';
import profile from '@/svgs/default-profile.svg';

export type AvatarProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
        width: 2.4rem;
        height: 2.4rem;
        `;
      case 'md':
        return `
        width: 4rem;
        height: 4rem;
        `;
      case 'lg':
        return `
        width: 6.4rem;
        height: 6.4rem;
        `;
      case 'xl':
        return `
          width: 16rem;
          height: 16rem;
        `;
    }
  }}
`;

export const Avatar = ({ size = 'md', src = profile, onClick, ...props }: AvatarProps) => {
  return <StyledAvatar as="img" size={size} src={src} onClick={onClick} {...props} />;
};
