import { GameButton, Grid, IconButton, Text } from '@/common';
import { ReactComponent as Logo } from '@/svgs/logo-lg.svg';
import { ReactComponent as GoogleIcon } from '@/svgs/google.svg';
import { ReactComponent as GithubIcon } from '@/svgs/github.svg';
import { ReactComponent as FourtyTwoIcon } from '@/svgs/42.svg';

export const PrePage = () => {
  const handle42Login = () => {
    location.href = `${import.meta.env.VITE_API_URL}/auth/login/ft`;
  };

  const handleGoogleLogin = () => {
    location.href = `${import.meta.env.VITE_API_URL}/auth/login/google`;
  };

  return (
    <Grid
      container="flex"
      direction="column"
      justifyContent="center"
      alignItems="center"
      size={{ paddingLR: 2 }}
      style={{ marginBottom: '2rem' }}
    >
      <Logo width="100%" style={{ margin: '2rem' }} />
      <Grid
        as="section"
        container="flex"
        direction="column"
        justifyContent="center"
        alignItems="center"
        rowGap={1.5}
        size={{ paddingTB: 1 }}
      >
        <GameButton size="lg" color="secondary">
          LOGIN
        </GameButton>
        <GameButton size="lg">SIGN UP</GameButton>
      </Grid>
      <Grid
        as="section"
        container="flex"
        direction="column"
        justifyContent="center"
        alignItems="center"
        rowGap={1}
        size={{ paddingTB: 1 }}
      >
        <Text size="xxs" color="foreground">
          Or via social media
        </Text>
        <Grid container="flex" justifyContent="center" alignItems="center" gap={1}>
          <IconButton onClick={handleGoogleLogin}>
            <GoogleIcon />
          </IconButton>
          <IconButton>
            <GithubIcon />
          </IconButton>
          <IconButton onClick={handle42Login}>
            <FourtyTwoIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};
