import { ReactComponent as Logo } from '@/svgs/logo-sm.svg';
import { Grid, GridItemProps } from '../Grid';

export const Header = (props: GridItemProps) => {
  return (
    <Grid
      as="header"
      container="flex"
      justifyContent="space-between"
      alignItems="center"
      size={{ padding: 'header' }}
      {...props}
    >
      <Logo />
    </Grid>
  );
};
