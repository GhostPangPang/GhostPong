import { Grid, GridItemProps } from '../Grid';

interface ContentProps {
  children?: React.ReactNode;
}

export const Content = ({ children, ...props }: ContentProps & GridItemProps) => {
  return (
    <Grid
      as="main"
      container="flex"
      justifyContent="center"
      alignItems="center"
      size={{ padding: 'content', height: 'calc(100% - 10rem)' }}
      {...props}
    >
      {children}
    </Grid>
  );
};
