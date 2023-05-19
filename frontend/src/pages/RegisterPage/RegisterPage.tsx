import { GameButton } from '@/common/Button/GameButton';
import { Text } from '@/common/Text';
import { Grid } from '@/common/Grid';
import { post } from '@/libs/api';
import { useState } from 'react';
import { GameInput } from '@/common';

export const RegisterPage = () => {
  const [nickname, setNickname] = useState<string>('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.toLowerCase();
    setNickname(e.target.value);
  };

  const handleRegister = async () => {
    try {
      await post('user', { nickname });
    } catch (e) {
      console.log('error', e);
    }
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
