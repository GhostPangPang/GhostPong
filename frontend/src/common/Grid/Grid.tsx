import {
  FlexContainerProps,
  GridContainerProps,
  ItemProps,
  LayoutProps,
  PositionProps,
  ResponsiveProps,
} from '@/types/style';
import { forwardRef } from 'react';
import styled, { css } from 'styled-components';

type ContainerType = 'flex' | 'grid' | 'item';

export type GridItemProps = ItemProps & ResponsiveProps;
export type GridProps<T extends ContainerType = 'item'> = {
  as?: React.ElementType;
  ref?: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
  container?: T;
  size?: LayoutProps;
  position?: PositionProps;
  style?: React.CSSProperties;
  responsive?: ResponsiveProps;
} & GridItemProps &
  LayoutProps &
  PositionProps &
  (T extends 'flex' ? FlexContainerProps & ResponsiveProps : T extends 'grid' ? GridContainerProps : void);

const StyledGrid = styled.div<GridProps>`
  width: 100%;
  height: auto;
  ${(props) => css`
    display: block;
    ${props.order && `order: ${props.order};`}
    ${props.alignSelf && `align-self: ${props.alignSelf};`}
    ${props.justifySelf && `justify-self: ${props.justifySelf};`}
    ${props.flexGrow !== undefined && `flex-grow: ${props.flexGrow};`}
    ${props.flexShrink && `flex-shrink: ${props.flexShrink};`}
    ${props.flexBasis && `flex-basis: ${props.flexBasis};`}
    ${props.gridColumn && `grid-column: ${props.gridColumn};`}
    ${props.gridRow && `grid-row: ${props.gridRow};`}
    ${props.gridArea && `grid-area: ${props.gridArea};`}
  `}
  ${(props) =>
    props.size &&
    css`
      ${props.size.width && `width: ${props.size.width};`}
      ${props.size.height && `height: ${props.size.height};`}
      ${props.size.minWidth && `min-width: ${props.size.minWidth};`}
      ${props.size.minHeight && `min-height: ${props.size.minHeight};`}
      ${props.size.maxWidth && `max-width: ${props.size.maxWidth};`}
      ${props.size.maxHeight && `max-height: ${props.size.maxHeight};`}
      ${props.size.overflow && `overflow: ${props.size.overflow};`}
      ${props.size.overflowX && `overflow-x: ${props.size.overflowX};`}
      ${props.size.overflowY && `overflow-y: ${props.size.overflowY};`}
      ${props.size.padding &&
      (typeof props.size.padding === 'number'
        ? `padding: ${props.size.padding}rem;`
        : `padding:  ${props.theme.padding[props.size.padding]};`)}
        ${props.size.paddingLR &&
      `padding-left: ${props.size.paddingLR}rem; padding-right: ${props.size.paddingLR}rem;`}
        ${props.size.paddingTB &&
      `padding-top: ${props.size.paddingTB}rem; padding-bottom: ${props.size.paddingTB}rem;`}
    `}
  ${(props) =>
    props.position &&
    css`
      ${props.position.position && `position: ${props.position.position};`}
      ${props.position.top && `top: ${props.position.top};`}
      ${props.position.right && `right: ${props.position.right};`}
      ${props.position.bottom && `bottom: ${props.position.bottom};`}
      ${props.position.left && `left: ${props.position.left};`}
      ${props.position.zIndex && `z-index: ${props.position.zIndex};`}
    `}
    ${(props) => css`
    ${props.xs !== undefined &&
    `flex-grow: ${props.xs}; flex-basis: ${
      typeof props.xs === 'number' ? `${props.xs * 100}%` : props.xs === 'auto' ? 'auto' : '0'
    };`}
    @media (min-width: 600px) {
      ${props.sm !== undefined &&
      `flex-grow: ${props.sm}; flex-basis: ${
        typeof props.sm === 'number' ? `${props.sm * 100}%` : props.sm === 'auto' ? 'auto' : '0'
      };`}
    }
    @media (min-width: 960px) {
      ${props.md !== undefined &&
      `flex-grow: ${props.md}; flex-basis: ${
        typeof props.md === 'number' ? `${props.md * 100}%` : props.md === 'auto' ? 'auto' : '0'
      };`}
    }
    @media (min-width: 1280px) {
      ${props.lg !== undefined &&
      `flex-grow: ${props.lg}; flex-basis: ${
        typeof props.lg === 'number' ? `${props.lg * 100}%` : props.lg === 'auto' ? 'auto' : '0'
      };`}
    }
  `}
`;

const StyledFlexContainer = styled(StyledGrid)<GridProps<'flex'>>`
  ${(props) => css`
    display: flex;
    ${props.direction && `flex-direction: ${props.direction};`}
    ${props.wrap && `flex-wrap: ${props.wrap};`}
    ${props.gap && `grid-gap: ${props.gap}rem;`}
    ${props.columnGap && `grid-column-gap: ${props.columnGap}rem;`}
    ${props.rowGap && `grid-row-gap: ${props.rowGap}rem;`}
    ${props.justifyContent && `justify-content: ${props.justifyContent};`}
    ${props.alignItems && `align-items: ${props.alignItems};`}
    ${props.alignContent && `align-content: ${props.alignContent};`}
  `}
`;

const StyledGridContainer = styled(StyledGrid)<GridProps<'grid'>>`
  ${(props) => css`
    display: grid;
    ${props.columns &&
    `grid-template-columns: ${
      props.columnsSize ? `${props.columnsSize.map((size) => size + 'fr').join(' ')}` : `repeat(${props.columns}, 1fr)`
    };`}
    ${props.rows &&
    `grid-template-rows: ${
      props.rowsSize ? `${props.rowsSize.map((size) => size + 'fr').join(' ')}` : `repeat(${props.rows}, 1fr)`
    };`}
    ${props.areas && `grid-template-areas: ${props.areas};`}
    ${props.autoColumns && `grid-auto-columns: ${props.autoColumns};`}
    ${props.autoRows && `grid-auto-rows: ${props.autoRows};`}
    ${props.autoFlow && `grid-auto-flow: ${props.autoFlow};`}
    ${props.gap && `grid-gap: ${props.gap}rem;`}
    ${props.columnGap && `grid-column-gap: ${props.columnGap}rem;`}
    ${props.rowGap && `grid-row-gap: ${props.rowGap}rem;`}
    ${props.justifyContent && `justify-content: ${props.justifyContent};`}
    ${props.alignItems && `align-items: ${props.alignItems};`}
    ${props.alignContent && `align-content: ${props.alignContent};`}
  `}
`;

export const Grid = forwardRef(
  <T extends ContainerType>(
    {
      children,
      container,
      justifySelf,
      alignSelf,
      order,
      flexGrow,
      flexShrink,
      flexBasis,
      gridColumn,
      gridRow,
      gridArea,
      xs,
      sm,
      md,
      lg,
      ...props
    }: GridProps<T>,
    ref: React.Ref<HTMLElement>,
  ) => {
    if (container === 'grid') {
      const {
        gap,
        rowGap,
        columnGap,
        justifyContent,
        alignItems,
        alignContent,
        columns,
        rows,
        areas,
        autoFlow,
        autoRows,
        autoColumns,
        justifyItems,
        ...rest
      } = props as GridProps<'grid'>;
      return (
        <StyledGridContainer
          ref={ref}
          justifySelf={justifySelf}
          alignSelf={alignSelf}
          order={order}
          flexGrow={flexGrow}
          flexShrink={flexShrink}
          flexBasis={flexBasis}
          gridColumn={gridColumn}
          gridRow={gridRow}
          gridArea={gridArea}
          xs={xs}
          sm={sm}
          md={md}
          lg={lg}
          gap={gap}
          rowGap={rowGap}
          columnGap={columnGap}
          justifyContent={justifyContent}
          alignItems={alignItems}
          alignContent={alignContent}
          columns={columns}
          rows={rows}
          areas={areas}
          autoFlow={autoFlow}
          autoRows={autoRows}
          autoColumns={autoColumns}
          justifyItems={justifyItems}
          {...rest}
        >
          {children}
        </StyledGridContainer>
      );
    } else if (container === 'flex') {
      const { gap, rowGap, columnGap, justifyContent, alignItems, alignContent, direction, wrap, ...rest } =
        props as GridProps<'flex'>;
      return (
        <StyledFlexContainer
          ref={ref}
          justifySelf={justifySelf}
          alignSelf={alignSelf}
          order={order}
          flexGrow={flexGrow}
          flexShrink={flexShrink}
          flexBasis={flexBasis}
          gridColumn={gridColumn}
          gridRow={gridRow}
          gridArea={gridArea}
          xs={xs}
          sm={sm}
          md={md}
          lg={lg}
          gap={gap}
          rowGap={rowGap}
          columnGap={columnGap}
          justifyContent={justifyContent}
          alignItems={alignItems}
          alignContent={alignContent}
          direction={direction}
          wrap={wrap}
          {...rest}
        >
          {children}
        </StyledFlexContainer>
      );
    } else {
      return (
        <StyledGrid
          ref={ref}
          justifySelf={justifySelf}
          alignSelf={alignSelf}
          order={order}
          flexGrow={flexGrow}
          flexShrink={flexShrink}
          flexBasis={flexBasis}
          gridColumn={gridColumn}
          gridRow={gridRow}
          gridArea={gridArea}
          xs={xs}
          sm={sm}
          md={md}
          lg={lg}
          {...props}
        >
          {children}
        </StyledGrid>
      );
    }
  },
);

Grid.displayName = 'Grid';
