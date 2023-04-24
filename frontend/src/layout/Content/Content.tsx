import { Grid, GridItemProps } from '../Grid';

interface ContentProps {
  children?: React.ReactNode;
}

export const Content = ({ children, ...props }: ContentProps & GridItemProps) => {
  return (
    <Grid as="main" container="flex" size={{ padding: 'content' }} {...props}>
      {children}
    </Grid>
  );
};
