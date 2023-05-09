import { Grid, GridItemProps } from '../Grid';

interface ScrollableContentProps {
  children?: React.ReactNode;
}

export const ScrollableContent = ({ children, ...props }: ScrollableContentProps & GridItemProps) => {
  return (
    <Grid as="main" container="flex" direction="column" alignItems="center" size={{ padding: 'content' }} {...props}>
      {children}
    </Grid>
  );
};
