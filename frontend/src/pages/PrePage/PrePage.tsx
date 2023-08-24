import { GameButton, Grid, IconButton, Text } from '@/common';
import { ReactComponent as Logo } from '@/svgs/logo-lg.svg';
import { ReactComponent as GoogleIcon } from '@/svgs/google.svg';
import { ReactComponent as GithubIcon } from '@/svgs/github.svg';
import { ReactComponent as FourtyTwoIcon } from '@/svgs/42.svg';
import { useNavigate } from 'react-router-dom';

export const PrePage = () => {
  const navigation = useNavigate();

  const handle42Login = () => {
    location.href = `${import.meta.env.VITE_API_URL}/auth/login/ft`;
  };

  const handleGoogleLogin = () => {
    location.href = `${import.meta.env.VITE_API_URL}/auth/login/google`;
  };

  const handleGithubLogin = () => {
    location.href = `${import.meta.env.VITE_API_URL}/auth/login/github`;
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
        <GameButton size="lg" color="secondary" onClick={() => navigation('/auth/signin')}>
          LOGIN
        </GameButton>
        <GameButton size="lg" onClick={() => navigation('/auth/signup')}>
          SIGN UP
        </GameButton>
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
          <IconButton onClick={handleGithubLogin}>
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
