import { forwardRef } from 'react';
import { GSystemProps, getSystemStyle, Theme } from './GSystemStyle';
import { useTheme } from 'styled-components';

export type GComponentProps<T extends React.ElementType> = {
  as?: T;
} & GSystemProps &
  React.ComponentPropsWithRef<T>;

export type GComponentType = <T extends React.ElementType = 'div'>(
  props: GComponentProps<T>,
) => React.ReactElement | null;

// eslint-disable-next-line react/display-name
export const GComponent: GComponentType = forwardRef(
  <T extends React.ElementType = 'div'>({ as, ...props }: GComponentProps<T>) => {
    const Element = as || 'div';
    const theme = useTheme() as Theme;

    return <Element {...props} style={getSystemStyle(theme, props)} />;
  },
);
