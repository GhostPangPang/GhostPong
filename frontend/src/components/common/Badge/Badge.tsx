import React from 'react';
import styled from 'styled-components';

export interface BadgeProps {
  size: 'sm' | 'md' | 'lg';
  status: 'online' | 'offline' | 'game';
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
  children: JSX.Element;
}

const getSize = (size: string) => {
  switch (size) {
    case 'sm':
      return '4rem';
    case 'md':
      return '6.4rem';
    case 'lg':
      return '18rem';
  }
};

const StyledStatus = styled.div<{ status: 'online' | 'offline' | 'game' }>`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  position: absolute;
  top: 0rem;
  right: 0rem;
  transform: translate(40%, -40%);
  background-color: ${(props) => {
    switch (props.status) {
      case 'online':
        return '#2FD240';
      case 'offline':
        return '#8E8E8E';
      case 'game':
        return '#E57ADB';
    }
  }};
`;

const StyledBadge = styled.div<{ size: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1em;
  ${(props) => {
    const size = getSize(props.size);
    return `
      width: ${size};
      height: ${size};
    `;
  }}
  position: relative;
`;

export const Badge = ({ size, status, onClick, children }: BadgeProps) => {
  return (
    <StyledBadge size={size}>
      <StyledStatus status={status} />
      {React.cloneElement(children as React.ReactElement, { onClick })}
    </StyledBadge>
  );
};
