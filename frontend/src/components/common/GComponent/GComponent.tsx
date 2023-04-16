import { forwardRef } from 'react';
import { GSystemProps, getSystemStyle, Theme } from './GSystemStyle';
import { useTheme } from 'styled-components';

type AsProp<T extends React.ElementType> = {
  as?: T;
};

export type RefProp<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];

export type GComponentProps<T extends React.ElementType> = AsProp<T> &
  React.ComponentPropsWithoutRef<T> & { ref?: RefProp<T> };

export type GComponentType = <T extends React.ElementType>(
  props: GComponentProps<T> & {
    ref?: React.ComponentPropsWithRef<T>['ref'];
  },
) => React.ReactElement | null;

// 기존 HTML props 처리 + ref 처리
// eslint-disable-next-line react/display-name
export const GComponent: GComponentType = forwardRef(
  <T extends React.ElementType = 'div'>({ as, ...props }: GComponentProps<T>, ref: RefProp<T>['ref']) => {
    const Element = as || 'div';

    return <Element ref={ref} {...props} />;
  },
);

// SystemStyleProps 처리 + 기존 HTML props 처리 + ref 처리
// eslint-disable-next-line react/display-name
export const GStyledComponent: GComponentType = forwardRef(
  <T extends React.ElementType = 'div'>(
    { as, ...props }: GComponentProps<T> & GSystemProps,
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

    return <Element ref={ref} style={getSystemStyle(theme, sysProps)} {...otherProps} />;
  },
);
