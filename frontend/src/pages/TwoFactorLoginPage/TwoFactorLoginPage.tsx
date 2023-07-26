import { Grid, Text, GameInput, GameButton } from '@/common';
import { useInput } from '@/hooks';
import { ApiError, post } from '@/libs/api';
import { useMutation } from '@tanstack/react-query';
import { TokenResponse } from '@/dto/auth';
import { setAccessToken } from '@/libs/api/auth';
import { useEffect } from 'react';

const postVerifyCode = async (code: string) => {
  return await post<TokenResponse>('/auth/login/2fa', { code });
};

export const TwoFactorLoginPage = () => {
  const { value: code, onChange: handleCodeChange } = useInput('');
  const { mutate: verifyCode, isSuccess } = useMutation(postVerifyCode, {
    onSuccess: (data: TokenResponse) => {
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

  const handleVerify = () => {
    verifyCode(code);
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
        이메일로 전송된 인증번호를 입력해주세요
      </Text>
      <GameInput sizes="lg" color="secondary" placeholder="인증번호" onInput={handleCodeChange} value={code} />
      <GameButton size="md" color="primary" onClick={handleVerify}>
        인증하기
      </GameButton>
    </Grid>
  );
};
