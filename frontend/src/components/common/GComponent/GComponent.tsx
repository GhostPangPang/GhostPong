import { forwardRef } from 'react';

type AsProp<T extends React.ElementType> = {
  as?: T;
};

export type RefProp<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];

export type GComponentProps<T extends React.ElementType> = AsProp<T> &
  React.ComponentPropsWithoutRef<T> & { ref?: RefProp<T> };

export type GComponentType = <T extends React.ElementType>(
  props: GComponentProps<T> & {
    ref?: RefProp<T>;
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
