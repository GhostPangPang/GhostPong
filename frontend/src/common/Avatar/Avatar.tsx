import styled from 'styled-components';

export type AvatarProps = {
  size?: 'sm' | 'md' | 'lg';
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
} & React.ComponentPropsWithoutRef<'img'>;

const StyledAvatar = styled.img<AvatarProps>`
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

export const Avatar = ({
  size = 'md',
  src = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg',
  onClick,
  ...props
}: AvatarProps) => {
  return <StyledAvatar as="img" size={size} src={src} onClick={onClick} {...props} />;
};
