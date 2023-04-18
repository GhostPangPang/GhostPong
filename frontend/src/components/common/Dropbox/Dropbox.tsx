import React from 'react';
import styled from 'styled-components';

type Placement = 'topright' | 'topleft' | 'bottomright' | 'bottomleft';

export interface DropboxProps {
  items: { label: React.ReactNode; onClick?: () => void }[];
  size: 'sm' | 'md' | 'lg';
  placement: Placement;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

const List = styled.ul<{ placement: Placement }>`
  display: flex;
  flex-direction: column;
  list-style: none;
  background-color: #4f4f4f;
  border-radius: 0.4rem;
  color: white;
  font-size: 1.5rem;
  padding: 0rem;
  margin: 0;
  position: absolute;
  ${({ placement }) => {
    switch (placement) {
      case 'topright':
        return `
          bottom: calc(100%);
          right: calc(-150%);
          `;
      case 'topleft':
        return `
          bottom: calc(100%);
          left: calc(-150%);
          `;
      case 'bottomright':
        return `
          top: calc(100%);
          right: calc(-150%);
          `;
      case 'bottomleft':
        return `
          top: calc(100%);
          left: calc(-150%);
          `;
    }
  }}
`;

const Item = styled.li`
  padding: 1.5rem 3rem 1.5rem 1.5rem;
  cursor: pointer;
  /* white-space: nowrap; */
  &:hover {
    background-color: #626262;
    border-radius: 0.25rem;
  }
`;

const StyledDropBox = styled.div<{ size: DropboxProps['size'] }>`
  ${({ size }) => {
    switch (size) {
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
  transform: translate(0, -100%);
`;

export const Dropbox = ({ items, size, placement, isVisible, setIsVisible }: DropboxProps) => {
  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <StyledDropBox onMouseLeave={handleMouseLeave} size={size}>
      {isVisible && (
        <List placement={placement}>
          {items.map((item, index) => (
            <Item key={index} onClick={item.onClick}>
              {item.label}
            </Item>
          ))}
        </List>
      )}
    </StyledDropBox>
  );
};
