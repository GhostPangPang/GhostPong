import { Grid, GridItemProps } from '../Grid';
import { ContainerProps, LayoutProps, FlexContainerProps } from '@/types/style';

type ContentProps = {
  children?: React.ReactNode;
} & GridItemProps &
  Pick<ContainerProps, 'justifyContent' | 'alignItems'> &
  Pick<LayoutProps, 'padding' | 'height'> &
  Pick<FlexContainerProps, 'direction'>;

export const Content = ({
  children,
  direction,
  justifyContent,
  alignItems,
  padding,
  height,
  ...props
}: ContentProps) => {
  return (
    <Grid
      as="main"
      container="flex"
      direction={direction}
      justifyContent={justifyContent}
      alignItems={alignItems}
      size={{ padding, height }}
      {...props}
    >
      {children}
    </Grid>
  );
};
