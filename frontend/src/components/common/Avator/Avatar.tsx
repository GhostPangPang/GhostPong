import styled from 'styled-components';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
}

const getSize = (size: AvatarProps['size']) => {
  switch (size) {
    case 'sm':
      return '4rem';
    case 'md':
      return '6.4rem';
    case 'lg':
      return '18rem';
  }
};

const StyledAvatar = styled.img<AvatarProps>`
  ${(props) => {
    const size = getSize(props.size);
    return `
      width: ${size};
      height: ${size};
    `;
  }}
  border-radius: 50%;
  object-fit: cover;
`;

export const Avatar = ({
  src = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg',
  alt = 'default_name',
  size = 'medium',
  onClick,
}: AvatarProps) => {
  return <StyledAvatar src={src} alt={alt} size={size} onClick={onClick} />;
};
