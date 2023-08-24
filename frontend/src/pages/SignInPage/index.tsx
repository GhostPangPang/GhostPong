import { GameButton, GameInput, Grid, Text } from '@/common';
import { ApiError, ApiResponse, post } from '@/libs/api';
import { setAccessToken } from '@/libs/api/auth';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type SignInInfo = {
  email: string;
  password: string;
};

type TokenResponse = {
  token: string;
};

const postSignIn = async (info: SignInInfo) => {
  return await post<TokenResponse>('auth/login/local', info);
};

export default function SignInPage() {
  const [info, setInfo] = useState({
    email: '',
    password: '',
  });
  const { mutate: signIn, isSuccess } = useMutation(postSignIn, {
    onSuccess: (data: TokenResponse) => {
      console.log('login');
      const { token } = data;
      if (token) {
        setAccessToken(token);
      }
    },
    onError: (error: ApiError) => {
      alert(error.message);
    },
  });

  useEffect(() => {
    if (isSuccess) window.location.replace('/');
  }, [isSuccess]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignIn = () => {
    console.log('signin click');
    signIn(info);
  };

  return (
    <Grid
      as="section"
      container="flex"
      direction="column"
      justifyContent="center"
      alignItems="center"
      rowGap={1}
      size={{ height: '100%' }}
    >
      <Text as="h1" fontFamily="game" size="xxxl" weight="black">
        GhostPong
      </Text>
      <Text as="h1" size="sm" color="gray100" style={{ marginBottom: '1rem' }}>
        Login to continue
      </Text>
      <GameInput
        name="email"
        sizes="lg"
        color="secondary"
        placeholder="email"
        value={info.email}
        onChange={handleInput}
      />
      <GameInput
        name="password"
        type="password"
        sizes="lg"
        color="secondary"
        placeholder="password"
        value={info.password}
        onChange={handleInput}
      />
      <GameButton size="lg" color="primary" onClick={handleSignIn}>
        Log in
      </GameButton>
    </Grid>
  );
}
