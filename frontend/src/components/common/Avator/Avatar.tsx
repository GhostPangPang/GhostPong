import styled from 'styled-components';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
}

const getSize = (size: AvatarProps['size']) => {
  switch (size) {
    case 'small':
      return '4rem';
    case 'medium':
      return '6.4rem';
    case 'large':
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
