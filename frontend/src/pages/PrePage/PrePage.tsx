import { GameButton, Grid } from '@/common';
import { ReactComponent as Logo } from '@/svgs/logo-lg.svg';

export const PrePage = () => {
  const handleLogin = () => {
    location.href = `${import.meta.env.VITE_API_URL}/auth/42login`;
  };

  return (
    <Grid
      as="section"
      container="flex"
      direction="column"
      justifyContent="center"
      alignItems="center"
      rowGap={1.5}
      size={{ height: '100%' }}
    >
      <Logo style={{ margin: '1.5rem' }} />
      <GameButton size="lg">GAME START</GameButton>
      <GameButton size="lg" color="secondary" onClick={handleLogin}>
        LOGIN
      </GameButton>
    </Grid>
  );
};
