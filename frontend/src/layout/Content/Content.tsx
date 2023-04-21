import { Grid } from '../Grid';

interface ContentProps {
  children?: JSX.Element | JSX.Element[];
}

export const Content = ({ children }: ContentProps) => {
  return (
    <Grid as="main" size={{ height: '100%', padding: 'layout' }}>
      {children}
    </Grid>
  );
};
