import { GameButton } from '@/common/GameButton';
import { Grid } from '@/layout/Grid';
import { ReactComponent as Logo } from '@/svgs/logo-lg.svg';

export const PrePage = () => {
  return (
    <Grid as="section" container="flex" direction="column" justifyContent="center" alignItems="center" rowGap={1.5}>
      <Logo style={{ margin: '1.5rem' }} />
      <GameButton size="lg">GAME START</GameButton>
      <GameButton size="lg" color="secondary">
        LOGIN
      </GameButton>
    </Grid>
  );
};
