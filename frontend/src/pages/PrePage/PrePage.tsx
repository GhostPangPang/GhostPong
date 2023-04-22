import { Button } from '@/common/Button';
import { Grid } from '@/layout/Grid';
import { ReactComponent as Logo } from '@/svgs/logo-lg.svg';

export const PrePage = () => {
  return (
    <Grid as="section" container="flex" direction="column" justifyContent="center" alignItems="center" rowGap={1.5}>
      <Logo style={{ margin: '1.5rem' }} />
      <Button size="lg">GAME START</Button>
      <Button size="lg" color="secondary">
        LOGIN
      </Button>
    </Grid>
  );
};
