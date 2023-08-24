import { GameButton, GameInput, Grid, Text } from '@/common';
import { ApiError, ApiResponse, post } from '@/libs/api';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

type SignUpInfo = {
  email: string;
  nickname: string;
  password: string;
};

const postSignUp = async ({ email, nickname, password }: SignUpInfo) => {
  return await post('auth/signup/local', {
    email,
    nickname,
    password,
  });
};

export default function SignUpPage() {
  const [info, setInfo] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordcheck: '',
  });
  const { mutate: signUp } = useMutation(postSignUp, {
    onSuccess: (message: ApiResponse) => {
      console.log('signup', message);
    },
    onError: (error: ApiError) => {
      alert(error.message);
    },
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
    console.log(info);
  };

  const handleSignUp = () => {
    console.log('signup click');
    if (info.email === '' || info.nickname === '' || info.password === '' || info.passwordcheck === '') {
      alert('정보를 입력해주세요.');
      console.log(info);
      return;
    }
    if (info.password !== info.passwordcheck) {
      alert('비밀번호가 일치하지 않습니다.');
      setInfo({
        ...info,
        password: '',
        passwordcheck: '',
      });
      return;
    }
    signUp(info);
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
        Welcome to GhostPong !
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
        name="nickname"
        sizes="lg"
        color="secondary"
        placeholder="nickname"
        value={info.nickname}
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
      <GameInput
        name="passwordcheck"
        type="password"
        sizes="lg"
        color="secondary"
        placeholder="password check"
        value={info.passwordcheck}
        onChange={handleInput}
      />
      <GameButton
        size="lg"
        color="primary"
        onClick={handleSignUp}
        style={{ marginBottom: '1.5rem', marginTop: '1rem' }}
      >
        Sign up
      </GameButton>
    </Grid>
  );
}
