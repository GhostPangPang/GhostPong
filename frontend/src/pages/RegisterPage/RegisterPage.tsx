import { GameButton, Text, Grid, GameInput } from '@/common';
import { ApiError, post } from '@/libs/api';
import { setAccessToken } from '@/libs/api/auth';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type TokenResponse = {
  token: string;
};

const postRegisterUser = async (nickname: string) => {
  return await post<TokenResponse>('user', { nickname });
};

export const RegisterPage = () => {
  const [nickname, setNickname] = useState<string>('');
  const { mutate: registerUser, isSuccess } = useMutation(postRegisterUser, {
    onSuccess: (data: TokenResponse) => {
      console.log('register', data);
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
    e.target.value = e.target.value.toLowerCase();
    setNickname(e.target.value);
  };

  const handleRegister = () => {
    registerUser(nickname);
  };

  return (
    <Grid
      as="section"
      container="flex"
      direction="column"
      justifyContent="center"
      alignItems="center"
      rowGap={3}
      size={{ height: '100%' }}
    >
      <Text size="xl" weight="black">
        닉네임을 입력해주세요
      </Text>
      <GameInput sizes="md" color="secondary" placeholder="nickname" onInput={handleInput} value={nickname} />
      <GameButton size="md" color="primary" onClick={handleRegister}>
        START
      </GameButton>
    </Grid>
  );
};
