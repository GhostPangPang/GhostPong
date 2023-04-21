import { ReactComponent as Logo } from '@/svgs/logo-sm.svg';
import { Grid } from '../Grid';

export const Header = () => {
  return (
    <Grid
      as="header"
      container="flex"
      justifyContent="space-between"
      alignItems="center"
      size={{ height: '9.6rem', padding: 'layout' }}
    >
      <Logo />
    </Grid>
  );
};
