import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { darken, lighten } from 'polished';
import ResizeObserver from 'resize-observer-polyfill';

type Placement = 'topright' | 'topleft' | 'bottomright' | 'bottomleft';

export interface DropboxProps {
  items: { label: React.ReactNode; onClick?: () => void }[];
  desc?: string;
  placement: Placement;
  children: React.ReactNode;
}

const StyledDropbox = styled.div<{ width: number; height: number }>`
  display: flex;
  position: relative;
  width: ${({ width }) => (width ? `${width}px` : 'auto')};
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
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
  z-index: 100;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.2);
  ${({ placement }) => {
    switch (placement) {
      case 'topright':
        return `
          bottom: calc(100%);
          right: calc(0%);
          margin-bottom: 1rem;
          `;
      case 'topleft':
        return `
          bottom: calc(100%);
          left: calc(0%);
          margin-bottom: 1rem;
          `;
      case 'bottomright':
        return `
          top: calc(100%);
          right: calc(0%);
          margin-top: 1rem;
          `;
      case 'bottomleft':
        return `
          top: calc(100%);
          left: calc(0%);
          margin-top: 1rem;
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

const StyledDesc = styled.li`
  padding: 1.3rem 2.6rem 1.3rem 1.3rem;
  background: ${(props) => props.theme.color.surface};
  color: ${(props) => props.theme.color.foreground};
  font-size: 1.3rem; // 일부로 크기 조절했음
  white-space: nowrap;
`;

export const Dropbox = ({ items, placement, desc, children }: DropboxProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const dropboxRef = useRef<HTMLDivElement>(null);

  const handleOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
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
      if (!child) return;

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
      {React.isValidElement(children)
        ? React.cloneElement(children, { onClick: handleOnClick } as React.HTMLAttributes<HTMLElement>)
        : children}
      {isVisible && (
        <StyledList placement={placement} onMouseLeave={handleOnMouseLeave}>
          {desc ? <StyledDesc>{desc}</StyledDesc> : null /* desc가 있으면 표시 */}
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
