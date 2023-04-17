import { forwardRef } from 'react';
import { GSystemProps, getSystemStyle, Theme } from './GSystemStyle';
import { useTheme } from 'styled-components';

export type GComponentProps<T extends React.ElementType> = {
  as?: T;
} & GSystemProps &
  React.ComponentPropsWithoutRef<T>;

export type GComponentType = <T extends React.ElementType = 'div'>(
  props: GComponentProps<T> & {
    ref?: React.ComponentPropsWithRef<T>['ref'];
  },
) => React.ReactElement | null;

// eslint-disable-next-line react/display-name
export const GComponent: GComponentType = forwardRef(
  <T extends React.ElementType = 'div'>(
    { as, ...props }: GComponentProps<T>,
    ref: React.ComponentPropsWithRef<T>['ref'],
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

    return <Element ref={ref} style={getSystemStyle(theme, sysProps)} {...otherProps} />;
  },
);
