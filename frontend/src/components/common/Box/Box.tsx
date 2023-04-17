import { useTheme } from 'styled-components';
import { GComponentProps, GSystemProps, RefProp, getSystemStyle } from '../GComponent';
import { forwardRef } from 'react';
import { Theme } from '@/assets/styles/types';

type BoxProps<T extends React.ElementType = 'div'> = {
  width: string;
  height: string;
  display?: 'flex' | 'block' | 'inline-block' | 'inline-flex';
  flexDirection?: 'row' | 'column';
  justifyContent?: 'center' | 'flex-start' | 'flex-end';
  alignItems?: 'center' | 'flex-start' | 'flex-end';
  flexWrap?: 'wrap' | 'nowrap';
  flex?: string;
  gap?: string;
  margin?: string;
  overflow?: 'hidden' | 'visible';
  position?: 'relative' | 'absolute';
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zIndex?: number;
  cursor?: string;
  transition?: string;
  transform?: string;
  opacity?: number;
} & GComponentProps<T> &
  Omit<GSystemProps, 'backgroundColor'>;

export type BoxType = <T extends React.ElementType = 'div'>(props: BoxProps<T>) => React.ReactElement | null;

export const Box: BoxType & { displayName?: string } = forwardRef(
  <T extends React.ElementType = 'div'>(
    {
      as,
      width,
      height,
      display,
      flexDirection,
      justifyContent,
      alignItems,
      flexWrap,
      flex,
      gap,
      margin,
      overflow,
      position,
      top,
      left,
      right,
      bottom,
      zIndex,
      cursor,
      transition,
      transform,
      opacity,
      ...props
    }: BoxProps<T> & GSystemProps,
    ref: RefProp<T>['ref'],
  ) => {
    const Element = as || 'div';
    const theme = useTheme() as Theme;

    const [sysProps, otherProps] = Object.entries(props).reduce(
      ([picked, omitted]: [GSystemProps, Record<string, unknown>], [key, value]) => {
        if (key in theme) {
          picked[key as keyof GSystemProps] = value;
        } else {
          omitted[key] = value;
        }
        return [picked, omitted];
      },
      [{}, {}],
    );

    return (
      <Element
        ref={ref}
        style={{
          backgroundColor: theme.color.surface,
          borderRadius: theme.borderRadius.sm,
          width,
          height,
          display,
          flexDirection,
          justifyContent,
          alignItems,
          flexWrap,
          flex,
          gap,
          margin,
          overflow,
          position,
          top,
          left,
          right,
          bottom,
          zIndex,
          cursor,
          transition,
          transform,
          opacity,
          ...getSystemStyle(theme, sysProps),
        }}
        {...otherProps}
      />
    );
  },
);
Box.displayName = 'Box';
