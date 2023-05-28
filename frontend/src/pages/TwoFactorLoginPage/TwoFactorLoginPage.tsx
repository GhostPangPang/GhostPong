import { Grid, Text, GameInput, GameButton } from '@/common';
import { useInput } from '@/hooks';
import { post } from '@/libs/api';
import { useMutation } from '@tanstack/react-query';

const postVerifyCode = async (code: string) => {
  return await post('/auth/42login/2fa', { code });
};

export const TwoFactorLoginPage = () => {
  const { value: code, onChange: handleCodeChange } = useInput('');
  const { mutate: verifyCode } = useMutation(postVerifyCode, {
    onSuccess: () => {
      console.log('2차 인증 성공');
    },
    onError: () => {
      console.log('2차 인증 실패');
    },
  });

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
      <GameInput sizes="md" color="secondary" placeholder="인증번호" onInput={handleCodeChange} value={code} />
      <GameButton size="md" color="primary" onClick={handleVerify}>
        인증하기
      </GameButton>
    </Grid>
  );
};
