import styled from 'styled-components';
import { GComponent, GComponentProps } from '../GComponent';

export interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
}

export const Avatar = <T extends React.ElementType = 'img'>({
  as,
  size = 'md',
  src = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg',
  alt = 'default_name',
  onClick,
  ...props
}: AvatarProps & GComponentProps<T>) => {
  const Element = as || 'img';
  return <GAvatar as={Element} size={size} src={src} alt={alt} onClick={onClick} {...props} />;
};

const GAvatar = styled(GComponent)<AvatarProps>`
  border-radius: 50%;
  object-fit: cover;
  ${(props) => {
    switch (props.size) {
      case 'sm':
        return `
        width: 4rem;
        height: 4rem;
        `;
      case 'md':
        return `
        width: 6.4rem;
        height: 6.4rem;
        `;
      case 'lg':
        return `
        width: 18rem;
        height: 18rem;
        `;
    }
  }}
`;
