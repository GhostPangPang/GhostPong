import theme from '@/assets/styles/theme';

export type Theme = typeof theme;
export type Color = keyof Theme['color'];
export type FontSize = keyof Theme['fontSize'];
export type FontWeight = keyof Theme['fontWeight'];
export type BorderRadius = keyof Theme['borderRadius'];
export type BoxShadow = keyof Theme['boxShadow'];
export type Padding = keyof Theme['padding'];

export type ContainerProps = {
  gap?: number;
  rowGap?: number;
  columnGap?: number;
  justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
};

export type FlexContainerProps = {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
} & ContainerProps;

export type GridContainerProps = {
  columns?: number;
  rows?: number;
  areas?: string;
  autoColumns?: string;
  autoRows?: string;
  autoFlow?: string;
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
} & ContainerProps;

export type ItemProps = {
  justifySelf?: 'start' | 'end' | 'center' | 'stretch';
  alignSelf?: 'start' | 'end' | 'center' | 'stretch';
};

export type FlexItemProps = {
  order?: 'auto' | number;
  flexGrow?: number;
  flexShrink?: 'auto' | number;
  flexBasis?: 'auto' | 'fill' | 'max-content' | 'min-content' | 'fit-content' | 'content' | string;
} & ItemProps;

export type GridItemProps = {
  gridColumn?: string;
  gridRow?: string;
  gridArea?: string;
} & ItemProps;

export type LayoutProps = {
  display?: 'flex' | 'grid' | 'inline-flex' | 'inline-grid' | 'block' | 'inline-block' | 'inline' | 'none';
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit';
};

export type PositionProps = {
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  zIndex?: number;
};

export type ResponsiveProps = {
  xs?: number | 'auto';
  sm?: number | 'auto';
  md?: number | 'auto';
  lg?: number | 'auto';
};
