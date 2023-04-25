import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { darken, lighten } from 'polished';
import ResizeObserver from 'resize-observer-polyfill';

type Placement = 'topright' | 'topleft' | 'bottomright' | 'bottomleft';

export interface DropboxProps {
  items: { label: React.ReactNode; onClick?: () => void }[];
  placement: Placement;
  children: React.ReactNode;
}

const StyledDropbox = styled.div<{ width: number; height: number }>`
  display: flex;
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

const StyledList = styled.ul<{ placement: Placement }>`
  display: flex;
  flex-direction: column;
  list-style: none;
  background-color: #4f4f4f;
  border-radius: 0.4rem;
  color: white;
  font-size: 1.5rem;
  padding: 0rem;
  position: absolute;
  ${({ placement }) => {
    switch (placement) {
      case 'topright':
        return `
          bottom: calc(100%);
          right: calc(0%);
          `;
      case 'topleft':
        return `
          bottom: calc(100%);
          left: calc(0%);
          `;
      case 'bottomright':
        return `
          top: calc(100%);
          right: calc(0%);
          `;
      case 'bottomleft':
        return `
          top: calc(100%);
          left: calc(0%);
          `;
    }
  }}/* margin: 0.5rem; */
`;

const StyledItem = styled.li`
  padding: 1.3rem 2.6rem 1.3rem 1.3rem;
  cursor: pointer;
  &:hover {
    background: ${(props) => lighten(0.1, props.theme.color.surface)};
  }
  &:active {
    background: ${(props) => darken(0.1, props.theme.color.surface)};
  }
  white-space: nowrap;
`;

export const Dropbox = ({ items, placement, children }: DropboxProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const dropboxRef = useRef<HTMLDivElement>(null);

  const handleOnClick = () => {
    setIsVisible(!isVisible);
  };

  const handleOnMouseLeave = () => {
    setIsVisible(false);
  };

  // useEffect를 사용하여 자식의 크기를 가져온다.
  // 이렇게 하면 자식의 크기가 변경되어도 자동으로 크기를 가져올 수 있다.
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const child = dropboxRef.current?.firstChild as HTMLElement;
      const { width: childWidth, height: childHeight } = child.getBoundingClientRect();
      setDimensions({
        width: childWidth,
        height: childHeight,
      });
    });

    const child = dropboxRef.current?.firstChild;
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
    <StyledDropbox onClick={handleOnClick} ref={dropboxRef} width={dimensions.width} height={dimensions.height}>
      {children}
      {isVisible && (
        <StyledList placement={placement} onMouseLeave={handleOnMouseLeave}>
          {items.map((item, index) => (
            <StyledItem key={index} onClick={item.onClick}>
              {item.label}
            </StyledItem>
          ))}
        </StyledList>
      )}
    </StyledDropbox>
  );
};
