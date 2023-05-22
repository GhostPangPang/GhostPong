import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ResizeObserver from 'resize-observer-polyfill';

export interface BadgeProps {
  status: 'online' | 'offline' | 'game';
  onClick?: React.MouseEventHandler;
  children: React.ReactNode;
}

const StyledStatus = styled.div<{ status: 'online' | 'offline' | 'game' }>`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  position: absolute;
  top: 0rem;
  right: 0rem;
  transform: translate(40%, -40%);
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'online':
        return theme.color.online;
      case 'offline':
        return theme.color.gray100;
      case 'game':
        return theme.color.primary;
    }
  }};
`;

const StyledBadge = styled.div<{ width: number; height: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1em;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: relative;
`;

export const Badge = ({ status, onClick, children }: BadgeProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const child = badgeRef.current?.firstChild as HTMLElement;
      if (child) {
        const { width: childWidth, height: childHeight } = child.getBoundingClientRect();
        setDimensions({
          width: childWidth,
          height: childHeight,
        });
      }
    });
    const child = badgeRef.current?.firstChild;
    if (child instanceof HTMLElement) {
      observer.observe(child);
    }

    return () => {
      if (child instanceof HTMLElement) {
        observer.unobserve(child);
      }
    };
  }, []);

  return (
    <StyledBadge ref={badgeRef} width={dimensions.width} height={dimensions.height}>
      {React.cloneElement(children as React.ReactElement, { onClick })}
      <StyledStatus status={status} />
    </StyledBadge>
  );
};
