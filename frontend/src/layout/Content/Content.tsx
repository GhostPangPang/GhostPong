import { Grid } from '@/common/Grid';

type ContentProps = {
  children?: React.ReactNode;
};

export const Content = ({ children }: ContentProps) => {
  return (
    <Grid
      as="main"
      container="flex"
      direction="column"
      alignItems="center"
      size={{ padding: 'content', height: 'calc(100% - 10rem)' }}
    >
      {children}
    </Grid>
  );
};
